#!/usr/bin/env python3
"""Prepare review decisions for individually checked external practice links.

The script does not write to the SQLite database. It reuses URL/source records,
creates only missing metadata rows, and emits an explicit decision manifest for
apply_review_decisions.py to dry-run and apply with a backup.
"""
import argparse
import json
import sqlite3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DEFAULT_DATABASE = ROOT / ".local/content/content.sqlite"
DEFAULT_SOURCE = ROOT / "content/editorial/unicamp-2027/audited-practice-links-2026-10-10.json"
DEFAULT_MANIFEST = ROOT / ".local/content/staging/audited-practice-links-2026-10-10-decisions.json"


def build(database, source_path):
    source = json.loads(source_path.read_text())
    if source.get("version") != 1 or not source.get("items"):
        raise ValueError("Unsupported or empty audited practice-link package")
    db = sqlite3.connect(f"file:{database}?mode=ro", uri=True)
    db.row_factory = sqlite3.Row
    decisions = []
    next_source_id = db.execute("SELECT COALESCE(MAX(id),0)+1 FROM source_documents").fetchone()[0]
    next_resource_id = db.execute("SELECT COALESCE(MAX(id),0)+1 FROM resources").fetchone()[0]
    seen_urls = set()
    try:
        for item in source["items"]:
            url = item["url"]
            if url in seen_urls:
                raise ValueError(f"Duplicate URL in audited package: {url}")
            seen_urls.add(url)
            if not url.startswith("https://"):
                raise ValueError(f"Only HTTPS resources are accepted: {url}")
            required = ("curriculum_topic_id", "title", "provider", "selected_items", "scope_limit", "accessibility_note")
            if any(not str(item.get(key, "")).strip() for key in required):
                raise ValueError(f"Incomplete audit record: {item}")
            evidence_detail = (f"Consultado em {source['consulted_on']}. Itens conferidos: {item['selected_items']} "
                              f"Limites: {item['scope_limit']} Acessibilidade: {item['accessibility_note']}")
            source_row = db.execute("SELECT * FROM source_documents WHERE url=? ORDER BY id LIMIT 1", (url,)).fetchone()
            resource_row = db.execute("SELECT * FROM resources WHERE url=?", (url,)).fetchone()
            source_id = source_row["id"] if source_row else (resource_row["source_document_id"] if resource_row else None)
            if source_id is None:
                source_id = next_source_id
                next_source_id += 1
                rights_note = ("Acesso gratuito observado; licença para cópia ou adaptação não confirmada. "
                               "Guardar somente link e metadados; não reproduzir questões, imagens ou respostas.")
                decisions.append({
                    "table": "source_documents", "key": {"id": source_id}, "expected": {"exists": False},
                    "changes": {"id": source_id, "title": item["title"], "url": url,
                                "provider": item["provider"], "kind": "exercise", "is_official": 0,
                                "reuse_status": "link_only", "license_name": None, "license_url": None,
                                "attribution": item["provider"], "rights_note": rights_note},
                    "reason": "Registrar a origem do recurso e preservar a condição link-only.",
                    "evidence": [{"locator": url, "detail": evidence_detail}],
                })
            elif resource_row and resource_row["source_document_id"] is None:
                # A link record without a source document may reuse a matching
                # record, but a missing record is created above.
                source_id = next_source_id
                next_source_id += 1
                rights_note = ("Acesso gratuito observado; licença para cópia ou adaptação não confirmada. "
                               "Guardar somente link e metadados; não reproduzir questões, imagens ou respostas.")
                decisions.append({
                    "table": "source_documents", "key": {"id": source_id}, "expected": {"exists": False},
                    "changes": {"id": source_id, "title": item["title"], "url": url,
                                "provider": item["provider"], "kind": "exercise", "is_official": 0,
                                "reuse_status": "link_only", "license_name": None, "license_url": None,
                                "attribution": item["provider"], "rights_note": rights_note},
                    "reason": "Registrar a origem do recurso e preservar a condição link-only.",
                    "evidence": [{"locator": url, "detail": evidence_detail}],
                })

            editorial_note = (f"Auditoria de item selecionado ({source['consulted_on']}): {item['selected_items']} "
                              f"Limite: {item['scope_limit']} {item['accessibility_note']} "
                              "Acesso gratuito observado; direitos de cópia/adaptação não confirmados: usar apenas o link.")
            resource_values = {
                "title": item["title"], "provider": item["provider"], "kind": "exercise",
                "description": item["selected_items"], "is_free": 1, "is_published": 1,
                "source_document_id": source_id, "editorial_status": "published",
                "editorial_note": editorial_note, "availability_mode": "practice",
            }
            if resource_row:
                resource_id = resource_row["id"]
                current = dict(resource_row)
                changes = {key: value for key, value in resource_values.items() if current.get(key) != value}
                if changes:
                    decisions.append({
                        "table": "resources", "key": {"id": resource_id},
                        "expected": {key: current[key] for key in changes}, "changes": changes,
                        "reason": "Aprovar somente os itens identificados nesta auditoria; os demais itens da página ficam explicitamente fora do escopo aprovado.",
                        "evidence": [{"locator": url, "detail": evidence_detail}],
                    })
            else:
                resource_id = next_resource_id
                next_resource_id += 1
                decisions.append({
                    "table": "resources", "key": {"id": resource_id}, "expected": {"exists": False},
                    "changes": {"id": resource_id, "url": url, **resource_values},
                    "reason": "Disponibilizar a seleção de exercícios auditada, sem copiar o conteúdo externo.",
                    "evidence": [{"locator": url, "detail": evidence_detail}],
                })

            topic_row = db.execute("""
                SELECT * FROM resource_topics
                WHERE resource_id=? AND topic_id IS NULL AND curriculum_topic_id=?
            """, (resource_id, item["curriculum_topic_id"])).fetchone()
            topic_values = {
                "review_status": "published", "relevance_status": "relevant",
                "accessibility_status": "unknown", "review_note": evidence_detail,
            }
            if topic_row:
                current = dict(topic_row)
                changes = {key: value for key, value in topic_values.items() if current.get(key) != value}
                if changes:
                    decisions.append({
                        "table": "resource_topics",
                        "key": {"resource_id": resource_id, "topic_id": None,
                                "curriculum_topic_id": item["curriculum_topic_id"]},
                        "expected": {key: current[key] for key in changes}, "changes": changes,
                        "reason": "Vínculo editorial direto ao tópico anual, com escopo e acessibilidade documentados.",
                        "evidence": [{"locator": url, "detail": evidence_detail}],
                    })
            else:
                decisions.append({
                    "table": "resource_topics",
                    "key": {"resource_id": resource_id, "topic_id": None,
                            "curriculum_topic_id": item["curriculum_topic_id"]},
                    "expected": {"exists": False},
                    "changes": {"resource_id": resource_id, "topic_id": None,
                                "curriculum_topic_id": item["curriculum_topic_id"], **topic_values},
                    "reason": "Vínculo editorial direto ao tópico anual, com escopo e acessibilidade documentados; não é uma classificação oficial da Comvest.",
                    "evidence": [{"locator": url, "detail": evidence_detail}],
                })

            target = db.execute("SELECT 1 FROM resource_targets WHERE resource_id=? AND stage_id=11", (resource_id,)).fetchone()
            if not target:
                decisions.append({
                    "table": "resource_targets", "key": {"resource_id": resource_id, "stage_id": 11},
                    "expected": {"exists": False},
                    "changes": {"resource_id": resource_id, "stage_id": 11},
                    "reason": "Escopar o recurso de prática para a primeira fase da Unicamp 2027.",
                    "evidence": [{"locator": f"sqlite://curriculum_topic_stages/{item['curriculum_topic_id']}/11",
                                  "detail": "O tópico pertence ao programa oficial da primeira fase Unicamp 2027."}],
                })
        return {"format": "editorial-review-decisions/v1", "summary": "Práticas externas auditadas individualmente; itens e limites explícitos, direitos link-only.", "decisions": decisions}
    finally:
        db.close()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--database", type=Path, default=DEFAULT_DATABASE)
    parser.add_argument("--source", type=Path, default=DEFAULT_SOURCE)
    parser.add_argument("--output", type=Path, default=DEFAULT_MANIFEST)
    args = parser.parse_args()
    manifest = build(args.database, args.source)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"manifest": str(args.output), "decisions": len(manifest["decisions"])}))


if __name__ == "__main__":
    main()
