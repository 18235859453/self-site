# Online Editor Implementation Plan

**Goal:** Let the owner manage Hugo articles and uploaded images through hosted Pages CMS.

**Architecture:** Configure the existing repository for Pages CMS and link to its hosted editor from Hugo navigation. Keep the current content bundles and deployment workflow.

**Tech Stack:** Hugo, YAML, GitHub Pages, Pages CMS.

## Tasks

- [x] Check official configuration and upstream implementation for nested filenames, exclusions, defaults and media paths.
- [x] Add `.pages.yml`: a Chinese posts collection under `content/post`, YAML frontmatter, `index.md` bundles, English-file exclusions, title/date/taxonomy/image/body/draft fields, default draft enabled. Use a shared static upload directory with the site's `/self-site/` URL prefix.
- [x] Add a “写文章” external menu item in `config/_default/menu.toml`, using the existing theme's menu layout and an existing icon.
- [x] Update `写博客指南.md` with first-login authorization, routine editing and publishing, draft visibility, source mode for advanced Markdown, and deployment troubleshooting.
- [x] Validate YAML and upstream configuration compatibility. Build a temporary copy of the site with a fixture containing an uploaded cover/body image; verify rendered image URLs and draft exclusion, then publish the fixture locally and verify output. Never push fixture content.
- [x] Run `hugo --gc --minify`, inspect navigation and existing article output, and run `git diff --check`.
- [x] Commit only this feature's files. Push via the existing SSH remote and verify deployment: run 36212578418 completed successfully and the live homepage returned HTTP 200 with the CMS link.

## Boundaries

Existing untracked theme experiments are outside this change. No credentials go in source. Browser login and GitHub App authorization belong to the user. Online editing verification requires that authorization; a successful Hugo build alone does not prove the hosted editor works.

## Verification record

- Hugo 0.161.1 production build passed (79 Chinese pages, 23 English pages).
- YAML validated with the upstream Pages CMS 2.1.8 Zod configuration schema; field-type names extracted from its registry, without loading its React UI.
- All 11 Chinese posts have explicit draft states. Four formerly implicit published states were made explicit to avoid the new default unpublishing them on edit.
- The one existing nonempty Chinese cover field was migrated to a byte-identical copy in the shared media folder. Original bundle assets remain for the body and English article.
- Temporary-site integration passed: draft title absent from HTML/JSON/XML output; published Chinese fixture and both cover/body upload URLs render; English gallery remains; no fixture was added to this repository.
- Browser checked navigation and successful cover loading. Authenticated CMS displays all 11 Chinese posts and the correct new-entry defaults. Initial live write checks exposed a missing GitHub App installation (login authorization alone permits public reads); the owner then approved installation limited to `self-site`.
- Live CMS verification passed: created a Chinese draft, uploaded a cover, saved the cover selection, and fetched the resulting repository commit to verify `draft: true` and `/self-site/uploads/...` output. The CMS-triggered deployments completed successfully (runs 36213564401, 36213594279, 36213632717). The temporary article and duplicated test upload were then removed.
- Enable `settings.content.merge` so future or existing metadata outside the editor schema is preserved during updates.
- Independent source review found no actionable blocker. Timestamp folder names avoid the upstream slugifier dropping Chinese titles; Hugo's public URL still follows title unless an explicit slug is supplied.
