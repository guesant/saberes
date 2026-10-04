type CommitConfig = {
  commitTypes?: string[];
  headerMaxLength?: number;
  bodyEmpty?: boolean;
  footerEmpty?: boolean;
};

type CommitConfigFileBase = Omit<CommitConfig, "commitTypes">;

interface CommitConfigFile extends CommitConfigFileBase {
  types?: string[];
}

const fileConfig = JSON.parse(
  await Deno.readTextFile(".config/commitlint.json"),
) as CommitConfigFile;

const config: CommitConfig = {
  ...fileConfig,
  commitTypes: fileConfig.types,
};

const allowedCommitTypes = config.commitTypes ?? [];

const output = new Deno.Command("git", {
  args: ["log", "-1", "--format=%B"],
  stdout: "piped",
}).outputSync();

if (!output.success) {
  throw new Error("Unable to read the latest commit.");
}

const message = new TextDecoder().decode(output.stdout).trimEnd();

const lines = message.split("\n");

const subject = lines[0] ?? "";

const typePattern = allowedCommitTypes.join("|");

const conventional = new RegExp(`^(${typePattern})(\\([^)]+\\))?!?: .+$`);

if (!conventional.test(subject)) {
  throw new Error("Latest commit does not follow the configured Conventional Commit format.");
}

if ((config.headerMaxLength ?? 0) > 0 && subject.length > (config.headerMaxLength ?? 0)) {
  throw new Error("Latest commit subject exceeds the configured header length.");
}

if (config.bodyEmpty && lines.slice(1).some((line) => line.trim() !== "")) {
  throw new Error("Commit body is not allowed by the repository policy.");
}

if (config.footerEmpty && lines.slice(1).some((line) => /^[A-Za-z][A-Za-z-]*:/.test(line))) {
  throw new Error("Commit footers are not allowed by the repository policy.");
}

console.log("Commit policy passed.");
