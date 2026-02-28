const env = {
  ...process.env,
  ANCHOR_PROVIDER_URL: "http://localhost:8899",
  ANCHOR_WALLET: require("os").homedir() + "/.config/solana/id.json"
};

require("child_process").execSync(
  "npx ts-mocha -p ./tsconfig.json -t 1000000 'tests/**/*.ts'",
  { stdio: "inherit", cwd: __dirname, env: env }
);
