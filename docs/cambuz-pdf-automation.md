# Cambuz PDF repository automation patch

`cambuz-pdf-automation.patch` is the matching upstream half of the landing-site
release sync. It was prepared against `rajeshkamboj/cambuz-pdf` commit
`da7420d3ca` and should be submitted as a normal pull request to that repository.

## What it adds

- A `main` build that has **all five** advertised installers publishes a pinned
  GitHub pre-release named `v<package-version>-build.<run-number>`.
- The release job uses the published GitHub API asset records to update the
  marked README download block, including permanent direct URLs, byte sizes and
  SHA-256 values. It never obtains those values by guessing.
- A small, CI-validated `docs/landing-content.json` contract supplies reviewed
  feature copy for this site. It is deliberately not generated from arbitrary
  application code: that would not be a reliable or honest way to make product
  claims.
- The release job dispatches the exact tag and source SHA to the landing site.
  A manually pushed tag can still create a release, but does not move the
  app README or landing site backwards.

The workflow refuses to publish a new public download set when any advertised
installer is missing. Existing downloads remain in place instead of exposing a
partial release.

## Apply and review

From a fresh clone of `rajeshkamboj/cambuz-pdf` (or an up-to-date local clone):

```bash
git checkout main
git pull --ff-only
git am /path/to/cambuz-landing/docs/cambuz-pdf-automation.patch
node scripts/validate-landing-content.mjs
npm test
```

If the app repository has moved since the patch was generated, create a branch,
apply it with `git apply --3way` or resolve the small workflow/README conflicts,
then open a pull request. Review the workflow particularly carefully: merging it
makes every fully successful `main` build a public pre-release.

## Required one-time secret

Before merging the upstream PR, create a **fine-grained GitHub token** limited to
the `rajeshkamboj/cambuz-landing` repository with **Contents: read and write**
permission. Add it to the `cambuz-pdf` repository as the Actions secret
`CAMBUZ_LANDING_DISPATCH_TOKEN`.

The token is only used to call GitHub's `repository_dispatch` endpoint; it is not
stored in this repository or in the patch. Without it, the landing workflow's
hourly repair sync will still discover the newest automatic release after both
PRs are merged, but the normal update will not be immediate.
