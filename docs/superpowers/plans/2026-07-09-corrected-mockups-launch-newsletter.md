# Corrected Mockups And Launch Newsletter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Correct every visible outdated book-cover plane with the approved centered-subtitle artwork, then rebuild the existing launch-newsletter package around those corrected assets and the approved launch copy.

**Architecture:** A small deterministic Python/OpenCV pipeline owns source locking, perspective composites, low-frequency environmental illumination preservation, derivatives, and comparison proofs. The existing Markdown, plain-text, table-based HTML, and Flodesk guide remain the editable campaign sources. A narrow validation script and Playwright render pass prove links, copy, accessibility structure, responsive geometry, deadline state, and generated previews.

**Tech Stack:** Python 3, pytest, Pillow, NumPy, OpenCV (`uv run --with pytest --with pillow --with numpy --with opencv-python-headless`), static HTML email, Markdown, Node.js, Playwright 1.61.0.

## Global Constraints

- Treat `docs/superpowers/specs/2026-07-09-mockups-launch-newsletter-design.md` as authoritative.
- Final front cover: `exports/kdp-ebook-cover-1600x2560-fixed.png`.
- Paperback wrap reference only: `exports/kdp-paperback-cover-updated-synopsis-final.pdf`.
- Never redraw, retype, crop, non-uniformly scale, or generatively recreate the approved cover.
- Apply one perspective transform to the complete cover bounds for each visible plane.
- Never place front-cover art on spines, page blocks, backgrounds, adjacent books, or inferred hidden planes.
- Preserve original scene dimensions, aspect ratios, shadows, glare, texture, highlights, and edge softness.
- Preserve the open-book source byte-identically; only its email derivative is transcoded.
- Use the LinkedIn book-stack correction as the newsletter hero.
- Amazon URL: `https://www.amazon.com/Unfolding-Origami-Memoir-Loren-Galese/dp/B0H7YZ5N28`.
- Excerpt URL: `https://wovenself.com/excerpt-unfolding-origami`.
- Signed-copy URL: `https://buy.stripe.com/dRm28r0bp9Mc8ocdD53cc00`.
- Sarah Edmondson URL: `https://alittlebitculty.com/`.
- Review attribution: `- Amazon Review`.
- Signed-copy deadline: `July 20, 2026`.
- After July 20, 2026, validation must fail with `DEADLINE_REVIEW_REQUIRED` when the signed-copy CTA remains active. Do not silently remove, extend, or rewrite the deadline.
- Use four to six desktop butterfly appearances, beginning with five; retain at least three on mobile.
- Decorative butterflies use real cover-derived PNG assets, `alt=""`, and presentation-only rows.
- Do not change the public website, Part 2 newsletter files, InDesign source, paperback PDF, or unrelated dirty files.
- Do not commit, push, deploy, publish, schedule, send, or modify Flodesk without explicit authorization.
- Because commits are not authorized, each task ends with a scoped diff checkpoint instead of a commit.

## Image Data Convention

Use one explicit channel convention throughout the image pipeline:

- Pillow inputs are loaded as `RGBA`.
- Before OpenCV color-space operations, convert Pillow `RGBA` arrays to OpenCV `BGRA`.
- All internal OpenCV color arrays are `BGRA` or `BGR`.
- Before saving through Pillow, convert OpenCV `BGR` or `BGRA` arrays back to `RGB` or `RGBA`.
- Never treat Pillow RGB channel order as OpenCV BGR implicitly.

Example:

```python
rgba = np.array(Image.open(path).convert("RGBA"))
bgra = cv2.cvtColor(rgba, cv2.COLOR_RGBA2BGRA)
```

## Canvas Convention

All functions accepting `canvas_size` use:

```text
(width, height)
```

Never reverse this convention.

## File Map

### Create

- `newsletter/book-launch/scripts/build_launch_assets.py` — source locking, perspective replacement, lossless corrected intermediates, derivatives, and proof generation.
- `newsletter/book-launch/scripts/test_build_launch_assets.py` — pytest unit and artifact tests for the image pipeline.
- `newsletter/book-launch/scripts/validate_launch_newsletter.py` — copy, link, accessibility, asset, deadline, and active-content assertions.
- `newsletter/book-launch/scripts/render_launch_newsletter.mjs` — Playwright desktop/mobile rendering and geometry checks.
- `newsletter/book-launch/assets/source/final-cover.png` — byte-identical approved front-cover copy.
- `newsletter/book-launch/assets/source/paperback-wrap-reference.pdf` — byte-identical PDF reference copy.
- Four descriptively named source-mockup copies defined by the approved spec.
- Three lossless corrected PNG intermediates under `newsletter/book-launch/assets/corrected-working/`.
- Three corrected JPEG masters under `newsletter/book-launch/assets/corrected/`.
- Three email JPEGs under `newsletter/book-launch/assets/email/`.
- Three social JPEGs under `newsletter/book-launch/assets/social/`.
- Three decorative transparent PNG derivatives under `newsletter/book-launch/assets/decorative/`.
- Three mockup comparison proofs under `newsletter/book-launch/previews/`.

### Modify

- `newsletter/book-launch/launch-newsletter-copy.md` — canonical formatted copy and links.
- `newsletter/book-launch/launch-newsletter.txt` — plain-text fallback in the same content order.
- `newsletter/book-launch/launch-newsletter-preview.html` — table-based visual/email reference.
- `newsletter/book-launch/flodesk-build-guide.md` — exact block order, copy, images, links, butterfly placements, and mobile behavior.
- `newsletter/book-launch/link-map.md` — authoritative production destination map and validation notes.
- `newsletter/book-launch/README.md` — provenance, hashes, correction log, accepted plane coordinates, production URLs, deadline, review source, build order, and QA results.
- `newsletter/book-launch/previews/launch-newsletter-desktop.png` — regenerated desktop proof.
- `newsletter/book-launch/previews/launch-newsletter-mobile.png` — regenerated mobile proof.

### Preserve

- `/Users/josephstewart/Downloads/Loren-Galese-Unfolding-Origami-ereader-and-cover-Mockup-(web).png`
- `/Users/josephstewart/Downloads/Loren-Galese-Unfolding-Origami-OpenBook-Mockup-(linkedin).png`
- `/Users/josephstewart/Downloads/Loren-Galese-Unfolding-Origami-BookStack-Mockup-(insta).png`
- `/Users/josephstewart/Downloads/Loren-Galese-Unfolding-Origami-BookStack-Mockup--(linkedin).png`
- All existing dirty files outside `newsletter/book-launch/` and the new docs files.

---

### Task 1: Lock Source Provenance And Establish The Asset Test Harness

**Files:**
- Create: `newsletter/book-launch/scripts/test_build_launch_assets.py`
- Create: `newsletter/book-launch/scripts/build_launch_assets.py`
- Create: source copies under `newsletter/book-launch/assets/source/`

**Interfaces:**
- Consumes: the six approved absolute/local source files from the spec.
- Produces: `SourceSpec`, `sha256_file(path) -> str`, `copy_verified(source, destination) -> str`, and byte-identical source copies used by all later tasks.

- [ ] **Step 1: Record the baseline and verify every source path**

Run:

```bash
git status --short
file \
  exports/kdp-ebook-cover-1600x2560-fixed.png \
  exports/kdp-paperback-cover-updated-synopsis-final.pdf \
  /Users/josephstewart/Downloads/Loren-Galese-Unfolding-Origami-ereader-and-cover-Mockup-\(web\).png \
  /Users/josephstewart/Downloads/Loren-Galese-Unfolding-Origami-OpenBook-Mockup-\(linkedin\).png \
  /Users/josephstewart/Downloads/Loren-Galese-Unfolding-Origami-BookStack-Mockup-\(insta\).png \
  /Users/josephstewart/Downloads/Loren-Galese-Unfolding-Origami-BookStack-Mockup--\(linkedin\).png
```

Expected: all six paths exist. Verify actual pixel dimensions rather than assuming them. If PNG and JPEG variants both exist, compare dimensions and visible compression before selecting the higher-quality approved source. Record the selected path and SHA-256 hash.

- [ ] **Step 2: Write failing provenance tests**

Use pytest-style tests:

```python
def test_sha256_file_matches_hashlib(tmp_path):
    sample = tmp_path / "sample.bin"
    sample.write_bytes(b"unfolding-origami")
    assert assets.sha256_file(sample) == hashlib.sha256(b"unfolding-origami").hexdigest()


def test_copy_verified_preserves_bytes(tmp_path):
    source = tmp_path / "source.png"
    destination = tmp_path / "nested" / "copy.png"
    source.write_bytes(b"exact-source-bytes")
    digest = assets.copy_verified(source, destination)
    assert destination.read_bytes() == source.read_bytes()
    assert digest == assets.sha256_file(source) == assets.sha256_file(destination)


def test_all_approved_sources_exist():
    assert all(spec.source.exists() for spec in assets.SOURCE_SPECS)
```

- [ ] **Step 3: Run the tests and verify the expected import failure**

Run:

```bash
uv run --with pytest --with pillow --with numpy --with opencv-python-headless \
  pytest newsletter/book-launch/scripts/test_build_launch_assets.py -v
```

Expected: FAIL because `build_launch_assets.py` and its interfaces do not exist yet.

- [ ] **Step 4: Implement provenance interfaces and approved source mapping**

Implement:

```python
@dataclass(frozen=True)
class SourceSpec:
    source: Path
    destination: Path


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def copy_verified(source: Path, destination: Path) -> str:
    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(source, destination)
    source_hash = sha256_file(source)
    if sha256_file(destination) != source_hash:
        raise RuntimeError(f"copy verification failed: {destination}")
    return source_hash
```

Define `SOURCE_SPECS` with the exact selected source paths and destination names from the approved spec. Use `shutil.copyfile`; never decode and re-encode source assets.

- [ ] **Step 5: Run the provenance tests and copy sources**

Run:

```bash
uv run --with pytest --with pillow --with numpy --with opencv-python-headless \
  pytest newsletter/book-launch/scripts/test_build_launch_assets.py -v

uv run --with pillow --with numpy --with opencv-python-headless \
  python newsletter/book-launch/scripts/build_launch_assets.py --copy-sources

shasum -a 256 newsletter/book-launch/assets/source/*
```

Expected: tests PASS; destination hashes equal their selected sources; the open-book PNG copy is byte-identical.

- [ ] **Step 6: Inspect the scoped checkpoint**

Run:

```bash
git status --short newsletter/book-launch docs/superpowers
git diff --check -- newsletter/book-launch docs/superpowers
```

Expected: only the new source copies, scripts, approved spec, and plan appear in scope; no commit is created.

---

### Task 2: Build And Validate The Hybrid Cover Composites

**Files:**
- Modify: `newsletter/book-launch/scripts/build_launch_assets.py`
- Modify: `newsletter/book-launch/scripts/test_build_launch_assets.py`
- Create: `newsletter/book-launch/assets/corrected-working/*.png`
- Create: `newsletter/book-launch/assets/corrected/*.jpeg`
- Create: `newsletter/book-launch/previews/mockup-correction-proof-*.png`

**Interfaces:**
- Consumes: verified source copies from Task 1.
- Produces: `PlaneSpec`, `warp_cover`, `extract_low_frequency_illumination`, `composite_plane`, three lossless corrected PNG intermediates, three corrected JPEG masters, and three old/corrected/reference proof PNGs.

- [ ] **Step 1: Write failing geometry and transform tests**

```python
def test_plane_specs_are_inside_source_bounds():
    for mockup in assets.MOCKUP_SPECS:
        width, height = assets.image_size(mockup.source)
        for plane in mockup.planes:
            assert all(0 <= x < width and 0 <= y < height for x, y in plane.quad)


def test_warp_cover_maps_all_four_cover_corners():
    cover = np.zeros((160, 100, 4), dtype=np.uint8)
    cover[[0, 0, -1, -1], [0, -1, -1, 0]] = (255, 255, 255, 255)
    quad = ((20, 15), (140, 25), (130, 210), (10, 200))
    warped, mask = assets.warp_cover(cover, (180, 240), quad)

    for x, y in quad:
        region = mask[max(0, y - 2):y + 3, max(0, x - 2):x + 3]
        assert region.max() > 0


def test_composite_changes_only_inside_feathered_plane():
    source = np.full((300, 300, 3), 127, dtype=np.uint8)
    cover = np.full((160, 100, 4), (5, 10, 20, 255), dtype=np.uint8)
    quad = ((80, 30), (220, 40), (210, 270), (70, 260))
    output = assets.composite_plane(source, cover, quad)
    assert np.array_equal(output[:20], source[:20])
    assert np.array_equal(output[:, :50], source[:, :50])
```

- [ ] **Step 2: Run geometry tests and verify failure**

Run:

```bash
uv run --with pytest --with pillow --with numpy --with opencv-python-headless \
  pytest newsletter/book-launch/scripts/test_build_launch_assets.py -v
```

Expected: FAIL because transform interfaces and plane configuration are not implemented.

- [ ] **Step 3: Implement provisional plane configuration and outline proofs**

Use source-pixel coordinates in clockwise order.

Treat the following coordinates only as provisional initialization values. Generate outline proofs against the exact selected source files and inspect each edge at 100% and 200% zoom before approving or revising every quadrilateral.

```python
Point = tuple[int, int]
Quad = tuple[Point, Point, Point, Point]


@dataclass(frozen=True)
class PlaneSpec:
    name: str
    quad: Quad


@dataclass(frozen=True)
class MockupSpec:
    key: str
    source: Path
    working_output: Path
    output: Path
    planes: tuple[PlaneSpec, ...]


def image_size(path: Path) -> tuple[int, int]:
    with Image.open(path) as image:
        return image.size
```

Provisional coordinates:

```python
MOCKUP_SPECS = (
    MockupSpec(
        key="ereader",
        source=SOURCE_DIR / "Loren-Galese-Unfolding-Origami-ereader-and-cover-Mockup-(web).png",
        working_output=CORRECTED_WORKING_DIR / "ereader-corrected.png",
        output=CORRECTED_DIR / "Loren-Galese-Unfolding-Origami-ereader-and-cover-Mockup-(web)-corrected.jpeg",
        planes=(
            PlaneSpec(
                "upright-front",
                ((4580, 1018), (6172, 1018), (6172, 3468), (4580, 3468)),
            ),
        ),
    ),
    MockupSpec(
        key="instagram",
        source=SOURCE_DIR / "Loren-Galese-Unfolding-Origami-BookStack-Mockup-(insta).png",
        working_output=CORRECTED_WORKING_DIR / "instagram-stack-corrected.png",
        output=CORRECTED_DIR / "Loren-Galese-Unfolding-Origami-BookStack-Mockup-(insta)-corrected.jpeg",
        planes=(
            PlaneSpec("upright-front", ((317, 1088), (1157, 1088), (1157, 2709), (317, 2736))),
            PlaneSpec("top-cover", ((1216, 2141), (1950, 2063), (2825, 2213), (2122, 2483))),
        ),
    ),
    MockupSpec(
        key="linkedin",
        source=SOURCE_DIR / "Loren-Galese-Unfolding-Origami-BookStack-Mockup--(linkedin).png",
        working_output=CORRECTED_WORKING_DIR / "linkedin-stack-corrected.png",
        output=CORRECTED_DIR / "Loren-Galese-Unfolding-Origami-BookStack-Mockup--(linkedin)-corrected.jpeg",
        planes=(
            PlaneSpec("upright-front", ((508, 133), (1402, 133), (1406, 1750), (473, 1792))),
            PlaneSpec("top-cover", ((1466, 1188), (2214, 1109), (3062, 1264), (2268, 1481))),
        ),
    ),
)
```

Generate an outline-only proof before compositing.

For horizontal top-cover planes:

- derive corners from the outer cover edges;
- do not use the page block or spine edges;
- preserve any source shadow cast across the plane;
- do not extend artwork beyond the physical fore-edge or hinge.

Record final accepted coordinates in `newsletter/book-launch/README.md`.

- [ ] **Step 4: Implement perspective warp using explicit BGRA/BGR conventions**

```python
def warp_cover(cover_bgra, canvas_size, quad):
    height, width = cover_bgra.shape[:2]
    source = np.float32(
        ((0, 0), (width - 1, 0), (width - 1, height - 1), (0, height - 1))
    )
    destination = np.float32(quad)
    matrix = cv2.getPerspectiveTransform(source, destination)

    canvas_width, canvas_height = canvas_size

    warped = cv2.warpPerspective(
        cover_bgra,
        matrix,
        (canvas_width, canvas_height),
        flags=cv2.INTER_LANCZOS4,
        borderMode=cv2.BORDER_CONSTANT,
        borderValue=(0, 0, 0, 0),
    )

    mask_source = np.full((height, width), 255, dtype=np.uint8)
    mask = cv2.warpPerspective(
        mask_source,
        matrix,
        (canvas_width, canvas_height),
        flags=cv2.INTER_LINEAR,
        borderMode=cv2.BORDER_CONSTANT,
        borderValue=0,
    )

    return warped, mask
```

- [ ] **Step 5: Implement low-frequency illumination preservation only**

Do not transfer source-cover detail, old typography, old butterflies, old subtitle placement, or any other high-frequency content from the outdated cover.

Implement a scale-aware illumination field:

```python
def quad_scale(quad):
    points = np.array(quad, dtype=np.float32)
    top = np.linalg.norm(points[1] - points[0])
    right = np.linalg.norm(points[2] - points[1])
    bottom = np.linalg.norm(points[2] - points[3])
    left = np.linalg.norm(points[3] - points[0])
    return max(top, right, bottom, left)


def extract_low_frequency_illumination(source_bgr, warped_bgr, mask, quad):
    source_l = cv2.cvtColor(source_bgr, cv2.COLOR_BGR2LAB)[:, :, 0].astype(np.float32)
    warped_l = cv2.cvtColor(warped_bgr, cv2.COLOR_BGR2LAB)[:, :, 0].astype(np.float32)

    sigma = max(25.0, quad_scale(quad) * 0.025)

    source_low = cv2.GaussianBlur(source_l, (0, 0), sigma)
    warped_low = cv2.GaussianBlur(warped_l, (0, 0), sigma)

    ratio = source_low / np.maximum(warped_low, 8.0)
    ratio = np.clip(ratio, 0.90, 1.10)
    ratio[mask == 0] = 1.0

    return ratio
```

Then:

```python
def composite_plane(source_bgr, cover_bgra, quad):
    height, width = source_bgr.shape[:2]
    warped_bgra, mask = warp_cover(cover_bgra, (width, height), quad)
    warped_bgr = warped_bgra[:, :, :3]

    illumination = extract_low_frequency_illumination(
        source_bgr,
        warped_bgr,
        mask,
        quad,
    )

    shaded = np.clip(
        warped_bgr.astype(np.float32) * illumination[:, :, None],
        0,
        255,
    ).astype(np.uint8)

    feather = cv2.GaussianBlur(mask, (0, 0), 0.75).astype(np.float32) / 255.0

    return np.clip(
        shaded * feather[:, :, None]
        + source_bgr * (1.0 - feather[:, :, None]),
        0,
        255,
    ).astype(np.uint8)
```

Composite planes sequentially on a copy of the source.

- [ ] **Step 6: Save lossless corrected intermediates and required JPEG masters**

Save corrected working files as PNG before any JPEG encoding.

Export JPEG masters from the lossless PNG intermediates using Pillow:

```python
image.save(
    destination,
    format="JPEG",
    quality=95,
    subsampling=0,
    optimize=True,
)
```

Do not sharpen or alter regions outside the masks.

- [ ] **Step 7: Generate masters and proofs**

Run:

```bash
uv run --with pillow --with numpy --with opencv-python-headless \
  python newsletter/book-launch/scripts/build_launch_assets.py \
  --outline-proofs \
  --correct-mockups \
  --proofs
```

Expected:

- three outline proofs;
- three lossless corrected PNG intermediates;
- three full-resolution corrected JPEG masters;
- three side-by-side proofs named exactly as the spec requires.

- [ ] **Step 8: Run automated artifact checks**

Add and run tests asserting:

- corrected dimensions equal source dimensions;
- corrected aspect ratios equal source aspect ratios;
- open-book source is not included in `MOCKUP_SPECS`;
- proof files contain three labeled panels: old, corrected, final cover reference;
- pixels well outside each replacement mask remain within defined JPEG tolerance.

For outside-mask comparisons:

```python
assert mean_absolute_error <= 2.0
assert max_error <= 12
```

Use the lossless corrected PNG intermediate for strict geometry and masking tests. Use JPEG tolerance only for the final JPEG master.

- [ ] **Step 9: Inspect every corrected plane and proof at high zoom**

Inspect all corrected masters, lossless intermediates, outline proofs, and comparison proofs.

Confirm:

- centered `A Memoir`;
- sharp title;
- intact endorsement;
- intact author credentials;
- intact butterflies and origami art;
- correct top-plane mapping;
- no spill;
- continuous spines;
- preserved low-frequency shadow and glare;
- no ghosting from old typography or decorative details.

If any old lettering or old artwork remains visible, reject the composite and increase the low-frequency blur scale or revise the illumination method. Do not hide the defect with sharpening or opacity changes.

- [ ] **Step 10: Inspect the scoped checkpoint**

Run:

```bash
git diff --check
git status --short newsletter/book-launch
```

Do not commit.

---

### Task 3: Produce Email, Social, And Decorative Derivatives

**Files:**
- Modify: `newsletter/book-launch/scripts/build_launch_assets.py`
- Modify: `newsletter/book-launch/scripts/test_build_launch_assets.py`
- Create/replace: `newsletter/book-launch/assets/email/*`
- Create: `newsletter/book-launch/assets/social/*-corrected.jpg`
- Create: `newsletter/book-launch/assets/decorative/*.png`

**Interfaces:**
- Consumes: lossless corrected PNG intermediates, open-book source, and approved butterfly PNGs.
- Produces: optimized derivatives used by the HTML and Flodesk guide.

- [ ] **Step 1: Write failing derivative tests**

```python
EMAIL_OUTPUTS = (
    EMAIL_DIR / "unfolding-origami-launch-hero-corrected.jpg",
    EMAIL_DIR / "unfolding-origami-ereader-and-cover-corrected.jpg",
    EMAIL_DIR / "unfolding-origami-interior-spread.jpg",
)

DECORATIVE_OUTPUTS = (
    DECORATIVE_DIR / "pink-butterfly-small.png",
    DECORATIVE_DIR / "pink-butterfly-medium.png",
    DECORATIVE_DIR / "pink-butterfly-pair.png",
)


def test_decorative_outputs_have_transparency():
    for path in assets.DECORATIVE_OUTPUTS:
        image = Image.open(path)
        assert image.mode == "RGBA"
        assert image.getchannel("A").getextrema()[0] == 0


def test_email_outputs_fit_1280_pixel_bound():
    for path in assets.EMAIL_OUTPUTS:
        width, height = Image.open(path).size
        assert max(width, height) <= 1280
```

- [ ] **Step 2: Run tests and verify derivative failures**

```bash
uv run --with pytest --with pillow --with numpy --with opencv-python-headless \
  pytest newsletter/book-launch/scripts/test_build_launch_assets.py -v
```

Expected: FAIL because derivatives are absent.

- [ ] **Step 3: Implement deterministic resizing and export**

Use Pillow:

```python
image.thumbnail((1280, 1280), Image.Resampling.LANCZOS)
```

Never crop.

Save RGB JPEGs with:

```python
quality=88
optimize=True
progressive=True
subsampling=0
```

Map:

- lossless corrected LinkedIn stack -> email hero and LinkedIn social output;
- lossless corrected ereader -> email and web social output;
- lossless corrected Instagram stack -> Instagram social output;
- unchanged open-book source -> email interior spread;
- butterfly 3 -> small;
- butterfly 2 -> medium;
- butterfly 1 plus butterfly 3 -> transparent two-butterfly horizontal pair.

The pair is a layout derivative made only from approved assets. It is not a newly approved original artwork asset.

Keep total pair width at 64 pixels and each individual derivative within approved display guidance.

- [ ] **Step 4: Generate and test derivatives**

```bash
uv run --with pillow --with numpy --with opencv-python-headless \
  python newsletter/book-launch/scripts/build_launch_assets.py --derivatives

uv run --with pytest --with pillow --with numpy --with opencv-python-headless \
  pytest newsletter/book-launch/scripts/test_build_launch_assets.py -v
```

Expected: PASS; no source file hash changes.

- [ ] **Step 5: Visually inspect image derivatives and decorative PNGs**

Confirm:

- no unwanted crop;
- no cover distortion;
- no alpha halo;
- no metadata-dependent rotation;
- no cumulative JPEG degradation.

Record dimensions and hashes in the README.

- [ ] **Step 6: Inspect the scoped checkpoint**

Run:

```bash
git diff --check
git status --short newsletter/book-launch/assets
```

Do not commit.

---

### Task 4: Rewrite Canonical Newsletter Copy, Plain Text, Links, And Provenance Documentation

**Files:**
- Modify: `newsletter/book-launch/launch-newsletter-copy.md`
- Modify: `newsletter/book-launch/launch-newsletter.txt`
- Modify: `newsletter/book-launch/link-map.md`
- Modify: `newsletter/book-launch/README.md`
- Create: `newsletter/book-launch/scripts/validate_launch_newsletter.py`

**Interfaces:**
- Consumes: exact copy from the original task brief plus approved spec edits.
- Produces: canonical content used by HTML/Flodesk work and a reusable validator returning exit code 0 only when all assertions pass.

- [ ] **Step 1: Write the validator with failing assertions against the current package**

```python
AMAZON_URL = "https://www.amazon.com/Unfolding-Origami-Memoir-Loren-Galese/dp/B0H7YZ5N28"
EXCERPT_URL = "https://wovenself.com/excerpt-unfolding-origami"
SIGNED_URL = "https://buy.stripe.com/dRm28r0bp9Mc8ocdD53cc00"
SARAH_URL = "https://alittlebitculty.com/"
REVIEW_ATTRIBUTION = "- Amazon Review"
DEADLINE = "July 20, 2026"
DEADLINE_DATE = date(2026, 7, 20)

STALE = (
    "B0H27BM8K1",
    "Read More About the Memoir",
    "Order a Signed Copy",
    "while available",
    "preorder",
    "pre-order",
    "coming soon",
    "coming July",
)
```

Strict active-content scan files:

```python
ACTIVE_COPY_FILES = (
    "launch-newsletter-copy.md",
    "launch-newsletter.txt",
    "launch-newsletter-preview.html",
    "flodesk-build-guide.md",
    "link-map.md",
)
```

Do not apply a blanket stale-string failure to `README.md`.

For `README.md`:

- allow stale strings only inside an explicitly labeled `Migration Log` or `Removed Legacy Values` section;
- fail if stale strings appear in current production links, active instructions, QA acceptance criteria, or send guidance.

Deadline behavior:

- if current date is after `2026-07-20`;
- and the signed-copy CTA remains active;
- fail with `DEADLINE_REVIEW_REQUIRED`;
- do not mutate source files automatically.

- [ ] **Step 2: Run the validator and verify it fails on stale current content**

```bash
python3 newsletter/book-launch/scripts/validate_launch_newsletter.py
```

Expected: nonzero exit with named failures.

- [ ] **Step 3: Update formatted and plain-text copy in approved order**

Use:

- `Buy the Book on Amazon` -> Amazon URL;
- `Read an Excerpt` -> excerpt URL;
- `Buy the Memoir Now` -> Amazon URL;
- `Read the Book on Amazon` -> Amazon URL;
- `Buy on Amazon` -> Amazon URL;
- `Order Your Signed Copy` -> signed-copy URL;
- deadline exactly `Signed-copy orders are available through July 20, 2026.`;
- review attribution exactly `- Amazon Review`.

Do not insert butterfly markers into the plain-text fallback.

- [ ] **Step 4: Rewrite the link map**

Include the seven required placements, exact labels/destinations, no Associates parameters, and a note that the excerpt page remains hidden-by-link.

Do not claim a fresh remote HTTP check unless actually performed.

- [ ] **Step 5: Update README provenance and production sections**

Document:

- selected source paths and SHA-256 values;
- affected planes;
- accepted final quadrilateral coordinates;
- unchanged open-book result;
- low-frequency illumination composite method;
- corrected hero path;
- butterfly source/derivatives;
- starting butterfly placements;
- production URLs;
- deadline safety;
- review source;
- Flodesk order;
- mobile behavior;
- current QA status.

State that the package has not been sent, published, deployed, committed, pushed, or assembled in Flodesk.

- [ ] **Step 6: Run validator and source-level checks**

Strict scan:

```bash
python3 newsletter/book-launch/scripts/validate_launch_newsletter.py

rg -n "B0H27BM8K1|Read More About the Memoir|Order a Signed Copy|while available|preorder|pre-order|coming soon|coming July" \
  newsletter/book-launch/launch-newsletter-copy.md \
  newsletter/book-launch/launch-newsletter.txt \
  newsletter/book-launch/launch-newsletter-preview.html \
  newsletter/book-launch/flodesk-build-guide.md \
  newsletter/book-launch/link-map.md
```

For README:

```bash
python3 newsletter/book-launch/scripts/validate_launch_newsletter.py --check-readme-context
```

Expected after Task 4: HTML/Flodesk files may still fail until later tasks, but updated Markdown, plain text, link map, and README are valid.

- [ ] **Step 7: Inspect the scoped checkpoint**

Run:

```bash
git diff --check
git diff -- \
  newsletter/book-launch/launch-newsletter-copy.md \
  newsletter/book-launch/launch-newsletter.txt \
  newsletter/book-launch/link-map.md \
  newsletter/book-launch/README.md
```

Do not commit.

---

### Task 5: Rebuild The Accessible Table-Based HTML Preview

**Files:**
- Modify: `newsletter/book-launch/launch-newsletter-preview.html`
- Modify: `newsletter/book-launch/scripts/validate_launch_newsletter.py`

**Interfaces:**
- Consumes: Task 3 assets and Task 4 canonical copy.
- Produces: review HTML that Task 7 renders and validates.

- [ ] **Step 1: Add failing HTML structure checks**

Use `html.parser.HTMLParser` to collect links, images, alt values, classes, roles, and visible text.

Assert:

- exactly five elements with `data-butterfly="true"`;
- every butterfly has `alt=""`;
- every butterfly is inside a presentation-only row or table;
- hero and interior meaningful alt text match the task brief;
- review contains visible `★★★★★`;
- review contains screen-reader-only `5 out of 5 stars`;
- Sarah panel precedes but remains distinct from reader-review panel;
- no `script`;
- no `form`;
- no external stylesheet;
- no Tailwind;
- no decorative absolute positioning;
- no floats;
- no CSS background-image dependency;
- all four authoritative destinations are present;
- excerpt CTA follows the Amazon hero CTA group before the opening letter.

The `.sr-only` accessibility utility may use `position:absolute`; exempt that exact class while rejecting decorative absolute positioning elsewhere.

- [ ] **Step 2: Run validator and verify HTML-specific failures**

Expected: FAIL on stale URLs, missing review section, missing butterflies, and missing excerpt CTA.

- [ ] **Step 3: Update responsive primitives**

```css
.sr-only {
  border: 0 !important;
  clip: rect(1px, 1px, 1px, 1px) !important;
  clip-path: inset(50%) !important;
  height: 1px !important;
  overflow: hidden !important;
  padding: 0 !important;
  position: absolute !important;
  width: 1px !important;
  white-space: nowrap !important;
}

@media only screen and (max-width: 640px) {
  .mobile-hide {
    display: none !important;
    max-height: 0 !important;
    overflow: hidden !important;
  }

  .hero-action {
    display: block !important;
    width: 100% !important;
  }
}
```

- [ ] **Step 4: Replace body with approved sequence**

Use five butterfly rows:

1. small, centered, between hero and eyebrow;
2. medium, centered/right-safe, between hero CTAs and letter;
3. small, centered, between letter and interior image;
4. medium, centered, between interior CTA and Sarah panel;
5. small, centered, between reader review and `Choose Your Copy`.

Each row uses 4–8 pixels above and below.

Keep all five visible on mobile unless rendered QA shows crowding. If one is hidden, at least four remain.

Use separate `<td>` panels for Sarah and the reader review.

Reader-review panel:

- warm cream or pale blue surface;
- navy copy;
- pink star color;
- exact approved quotation;
- attribution exactly `- Amazon Review`.

Do not place a butterfly inside either quotation.

- [ ] **Step 5: Run validator and inspect HTML source**

Run:

```bash
python3 newsletter/book-launch/scripts/validate_launch_newsletter.py
```

Expected: PASS for content, links, ordering, active-copy checks, and accessibility-source assertions.

- [ ] **Step 6: Inspect the scoped checkpoint**

Run:

```bash
git diff --check
git diff -- newsletter/book-launch/launch-newsletter-preview.html
```

Do not commit.

---

### Task 6: Rewrite The Flodesk Build Guide To Match The Approved Render

**Files:**
- Modify: `newsletter/book-launch/flodesk-build-guide.md`
- Modify: `newsletter/book-launch/README.md`
- Modify: `newsletter/book-launch/scripts/validate_launch_newsletter.py`

**Interfaces:**
- Consumes: canonical copy, asset names, and final HTML order.
- Produces: one self-contained Flodesk assembly source with exact copy and settings.

- [ ] **Step 1: Add failing Flodesk-guide assertions**

Assert the guide contains ordered headings for:

- author identifier;
- corrected hero;
- five named butterfly placements;
- eyebrow;
- heading;
- subheading;
- both hero CTAs;
- opening letter;
- interior;
- interior CTA;
- Sarah endorsement;
- reader review;
- purchase section;
- deadline;
- support;
- closing;
- author links;
- native compliance footer.

- [ ] **Step 2: Run validator and verify guide failures**

Expected: FAIL because current guide lacks new blocks or uses stale destinations/copy.

- [ ] **Step 3: Rewrite guide block-by-block**

For each block specify:

- exact copy;
- file name;
- destination;
- alignment;
- width;
- colors;
- typography;
- spacing;
- mobile behavior.

Decorative subsection:

- `pink-butterfly-small.png` at 24–28 px between hero and eyebrow, centered;
- `pink-butterfly-medium.png` at 36–44 px between hero CTAs and letter, centered or slightly right only when safe;
- `pink-butterfly-small.png` at 20–28 px between letter and interior, left-safe or centered;
- `pink-butterfly-medium.png` at 28–36 px between interior CTA and Sarah, centered;
- `pink-butterfly-small.png` at 20–28 px between reader review and `Choose Your Copy`, centered.

Use 4–8 pixels above and below each butterfly block.

State:

- no freeform overlay;
- empty alt text;
- no butterfly hidden on mobile in the reference build;
- Flodesk may hide the second placement only if its actual mobile renderer crowds the CTA/letter transition.

- [ ] **Step 4: Update README build order and send boundary**

Mirror final guide order.

State:

- signed-copy date gate;
- desktop/mobile Flodesk test required before any send;
- local task did not create or send a Flodesk campaign.

- [ ] **Step 5: Run validator and strict stale scan**

Expected: PASS across all active source documents.

- [ ] **Step 6: Inspect the scoped checkpoint**

Run:

```bash
git diff --check
git diff -- \
  newsletter/book-launch/flodesk-build-guide.md \
  newsletter/book-launch/README.md
```

Do not commit.

---

### Task 7: Render Desktop And Mobile Proofs With Playwright

**Files:**
- Create: `newsletter/book-launch/scripts/render_launch_newsletter.mjs`
- Replace: `newsletter/book-launch/previews/launch-newsletter-desktop.png`
- Replace: `newsletter/book-launch/previews/launch-newsletter-mobile.png`
- Modify: `newsletter/book-launch/README.md`

**Interfaces:**
- Consumes: final HTML and image assets.
- Produces: accepted current-run screenshots and machine-readable geometry assertions printed to stdout.

- [ ] **Step 1: Verify existing Node dependencies without modifying package metadata**

If a compatible lockfile exists:

```bash
npm ci
```

Do not run `npm install`.

If Playwright is already installed, skip dependency installation.

If Playwright is absent and not declared in the existing package metadata, stop and report the dependency requirement rather than silently modifying `package.json` or lockfiles.

Install Chromium only when the declared Playwright package is available:

```bash
npx playwright install chromium
```

- [ ] **Step 2: Write a self-contained render script**

The render script must start and terminate its own local static server, or use a `file://` URL only if all relative assets resolve correctly.

Do not require a manually started persistent `python3 -m http.server` process.

Use:

- desktop viewport: 1440 × 1200;
- mobile viewport: 390 × 844.

Evaluate:

```javascript
const metrics = await page.evaluate(() => ({
  brokenImages: [...document.images].filter(
    (img) => !img.complete || img.naturalWidth === 0
  ).length,
  scrollOverflow:
    document.documentElement.scrollWidth -
    document.documentElement.clientWidth,
  butterflies: [
    ...document.querySelectorAll('[data-butterfly="true"]'),
  ].filter((el) => getComputedStyle(el).display !== 'none').length,
  amazonLinks: [
    ...document.querySelectorAll('a[href*="amazon.com"]'),
  ].map((a) => a.href),
  signedLinks: [
    ...document.querySelectorAll('a[href*="buy.stripe.com"]'),
  ].map((a) => a.href),
  minBodyFont: Math.min(
    ...[...document.querySelectorAll('.mobile-body')].map(
      (el) => parseFloat(getComputedStyle(el).fontSize)
    )
  ),
}));
```

Throw unless:

- `brokenImages === 0`;
- `scrollOverflow === 0`;
- every Amazon link contains `B0H7YZ5N28`;
- every signed link equals the approved Stripe URL;
- `minBodyFont >= 16`.

On mobile assert:

- purchase columns stack;
- both purchase buttons have equal computed height;
- at least three butterflies remain visible.

- [ ] **Step 3: Render**

Run:

```bash
node newsletter/book-launch/scripts/render_launch_newsletter.mjs
```

Expected:

- local server starts and stops within the script;
- desktop/mobile PNGs regenerate;
- all geometry checks pass;
- no orphaned process remains.

- [ ] **Step 4: Inspect both current-run screenshots**

Confirm:

- correct hero;
- separated hero CTAs;
- shorter letter;
- intact interior image;
- centered interior CTA;
- distinct Sarah and Amazon review treatments;
- equal desktop purchase buttons;
- stacked mobile purchase buttons;
- visible deadline;
- five restrained butterflies;
- readable copy;
- no clipping;
- no overflow.

- [ ] **Step 5: Compare desktop and mobile renders**

Fix visible padding, alignment, type, crop, or contrast issues.

Rerun the render script.

Accept only the latest screenshots.

- [ ] **Step 6: Update README with actual render results**

Record:

- viewport sizes;
- broken-image count;
- overflow result;
- desktop butterfly count;
- mobile butterfly count;
- screenshot paths.

Do not claim full WCAG compliance. Label keyboard and screen-reader client testing as outside screenshot-only QA.

- [ ] **Step 7: Inspect the scoped checkpoint**

Run:

```bash
git diff --check
file newsletter/book-launch/previews/launch-newsletter-desktop.png
file newsletter/book-launch/previews/launch-newsletter-mobile.png
```

Do not commit.

---

### Task 8: Run Final Package QA And Preserve Scope

**Files:**
- Modify only if a failing check identifies an in-scope defect.

**Interfaces:**
- Consumes: all prior outputs.
- Produces: a verified local handoff with no publication or external side effect.

- [ ] **Step 1: Run the complete automated suite**

```bash
uv run --with pytest --with pillow --with numpy --with opencv-python-headless \
  pytest newsletter/book-launch/scripts/test_build_launch_assets.py -v

python3 newsletter/book-launch/scripts/validate_launch_newsletter.py

node newsletter/book-launch/scripts/render_launch_newsletter.mjs

git diff --check
```

Expected: all commands PASS, subject to the date gate.

If current date is after July 20, 2026 and the signed-copy CTA remains active, expected validator result is:

```text
DEADLINE_REVIEW_REQUIRED
```

That result blocks send readiness until human review.

- [ ] **Step 2: Run final active-content stale scan and approved-value scan**

Strict active-content stale scan:

```bash
rg -n "B0H27BM8K1|Read More About the Memoir|Order a Signed Copy|while available|preorder|pre-order|coming soon|coming July" \
  newsletter/book-launch/launch-newsletter-copy.md \
  newsletter/book-launch/launch-newsletter.txt \
  newsletter/book-launch/launch-newsletter-preview.html \
  newsletter/book-launch/flodesk-build-guide.md \
  newsletter/book-launch/link-map.md
```

Approved values:

```bash
rg -n "B0H7YZ5N28|excerpt-unfolding-origami|buy\.stripe\.com|alittlebitculty\.com|- Amazon Review|July 20, 2026" \
  newsletter/book-launch/launch-newsletter-copy.md \
  newsletter/book-launch/launch-newsletter.txt \
  newsletter/book-launch/launch-newsletter-preview.html \
  newsletter/book-launch/flodesk-build-guide.md \
  newsletter/book-launch/link-map.md \
  newsletter/book-launch/README.md
```

Expected: only approved active destinations, attribution, and deadline appear.

- [ ] **Step 3: Verify source preservation and output inventory**

```bash
shasum -a 256 newsletter/book-launch/assets/source/*

file \
  newsletter/book-launch/assets/corrected-working/* \
  newsletter/book-launch/assets/corrected/* \
  newsletter/book-launch/assets/email/* \
  newsletter/book-launch/assets/social/* \
  newsletter/book-launch/assets/decorative/* \
  newsletter/book-launch/previews/*.png
```

Compare source-copy hashes with README values and confirm expected dimensions and formats.

- [ ] **Step 4: Perform final visual acceptance**

Inspect:

- three lossless corrected intermediates;
- three corrected JPEG masters;
- three outline proofs;
- three correction proofs;
- desktop newsletter preview;
- mobile newsletter preview.

Reject any:

- visible old subtitle placement;
- old typography ghosting;
- warped type;
- mask spill;
- mismatched lighting;
- cropped content;
- butterfly crowding;
- quotation merger;
- button misalignment;
- unreadable deadline.

- [ ] **Step 5: Review complete scoped diff and dirty-tree preservation**

```bash
git status --short
git diff --stat
git diff -- \
  newsletter/book-launch \
  docs/superpowers/specs/2026-07-09-mockups-launch-newsletter-design.md \
  docs/superpowers/plans/2026-07-09-corrected-mockups-launch-newsletter.md
```

Confirm pre-existing modifications outside scope remain untouched.

Do not stage or commit.

- [ ] **Step 6: Prepare the handoff**

Report:

- changed and created files;
- selected source paths;
- source hashes;
- accepted plane coordinates;
- production links;
- correction result per mockup;
- butterfly counts;
- mobile behavior;
- exact QA commands and results;
- screenshot and proof paths;
- deadline-gate state;
- Flodesk/manual-send boundary.

State explicitly that no commit, push, deploy, publication, Flodesk assembly, or send occurred.
