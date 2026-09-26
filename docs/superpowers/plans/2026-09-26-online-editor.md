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
- [ ] Commit only this feature's files. Check deployment access and, if possible, push the approved feature and verify the workflow. Otherwise provide the precise remaining authorization step.

## Boundaries

Existing untracked theme experiments are outside this change. No credentials go in source. Browser login and GitHub App authorization belong to the user. Online editing verification requires that authorization; a successful Hugo build alone does not prove the hosted editor works.

## Verification record

- Hugo 0.161.1 production build passed (79 Chinese pages, 23 English pages).
- YAML validated with the upstream Pages CMS 2.1.8 Zod configuration schema; field-type names extracted from its registry, without loading its React UI.
- All 11 Chinese posts have explicit draft states. Four formerly implicit published states were made explicit to avoid the new default unpublishing them on edit.
- The one existing nonempty Chinese cover field was migrated to a byte-identical copy in the shared media folder. Original bundle assets remain for the body and English article.
- Temporary-site integration passed: draft title absent from HTML/JSON/XML output; published Chinese fixture and both cover/body upload URLs render; English gallery remains; no fixture was added to this repository.
- Browser checked navigation and successful cover loading. Hosted CMS reaches its sign-in page; authenticated saving and uploading are pending owner authorization.
- Independent source review found no actionable blocker. Timestamp folder names avoid the upstream slugifier dropping Chinese titles; Hugo's public URL still follows title unless an explicit slug is supplied.
