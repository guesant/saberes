#!/usr/bin/env python3
"""Export unresolved editorial records from the whole authoritative database."""
import argparse
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path
import sqlite3

ROOT = Path(__file__).resolve().parents[2]


def inventory(database):
    pending, totals = [], {}
    with sqlite3.connect(f'file:{database}?mode=ro', uri=True) as db:
        db.row_factory = sqlite3.Row
        tables = [row[0] for row in db.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name")]
        for table in tables:
            columns = db.execute(f'PRAGMA table_info("{table}")').fetchall()
            names = {row['name'] for row in columns}
            primary = [row['name'] for row in sorted(columns, key=lambda row: row['pk']) if row['pk']]
            fields = names.intersection({'review_status', 'editorial_status', 'status'})
            if table == 'assessment_sets':
                fields.add('is_published')
            for field in sorted(fields):
                condition = f'"{field}"=0' if field == 'is_published' else f'"{field}" IN (\'draft\',\'review\',\'provisional\')'
                records = db.execute(f'SELECT * FROM "{table}" WHERE {condition}').fetchall()
                if not records:
                    continue
                totals[f'{table}.{field}'] = len(records)
                for row in records:
                    record = dict(row)
                    key = {column: record[column] for column in primary}
                    pending.append({
                        'table': table, 'key': key, 'field': field, 'state': record[field],
                        'record_sha256': hashlib.sha256(json.dumps(record, sort_keys=True, ensure_ascii=False).encode()).hexdigest(),
                        'label': next((str(record[name]) for name in ('title', 'name', 'label', 'slug', 'rule_key') if record.get(name)), None),
                        'stored_reason': next((record[name] for name in ('editorial_note', 'review_note', 'notes') if record.get(name)), None),
                    })
    return {'format': 'editorial-open-records/v1', 'generated_at': datetime.now(timezone.utc).isoformat(),
            'database_sha256': hashlib.sha256(Path(database).read_bytes()).hexdigest(),
            'totals': totals, 'records': pending,
            'warning': 'An unresolved status is not evidence of an error; approval requires substantive source review.'}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--database', type=Path, default=ROOT / '.local/content/content.sqlite')
    parser.add_argument('--output', type=Path, default=ROOT / 'tools/editorial/review-closure/open-records.json')
    args = parser.parse_args()
    result = inventory(args.database)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'output': str(args.output), 'groups': list(result['totals'])}))


if __name__ == '__main__':
    main()
