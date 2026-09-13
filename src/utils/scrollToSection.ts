/**
 * Scrolling to a section, and staying on it while the page settles.
 *
 * A smooth scroll travels to the pixel the browser computed when it started.
 * Anything that changes the height of the page in flight — an image finishing,
 * a section growing as it is passed — leaves that pixel pointing above the
 * section. That is why clicking Download in the first seconds after arriving,
 * or loading `/#download` directly and refreshing, stopped short of it.
 *
 * So the target is read from the live element rather than captured up front,
 * and re-read for a moment afterwards. Corrections are instant rather than
 * smooth: by then they are a few pixels, and a second animation would read as
 * drift.
 *
 * Both ways in share this — the nav and hero buttons, and the router when a
 * visit arrives with a hash already in the URL.
 */

/** How close to the intended position counts as arrived. */
const TOLERANCE = 4
/** How long to keep correcting before assuming the page has settled. */
const SETTLE_MS = 1200
/** How often to check during that window. */
const CHECK_MS = 120

/** How long to wait for a section that has not rendered yet. */
const APPEAR_MS = 2000

/**
 * The offset comes from each section's `scroll-margin-top`, declared in CSS.
 *
 * The section may not exist yet when this is called. On a visit that arrives
 * with a hash, the router asks for the scroll before the view has rendered, and
 * giving up there left the browser's own jump to the fragment as the only
 * positioning — which is the thing that lands short. So wait for it.
 */
export function scrollToSection(id: string): void {
    const deadlineToAppear = Date.now() + APPEAR_MS

    const attempt = () => {
        const element = document.getElementById(id)
        if (element) return begin(element)
        if (Date.now() < deadlineToAppear) requestAnimationFrame(attempt)
    }
    attempt()
}

function begin(element: HTMLElement): void {
    const behavior: ScrollBehavior = window.innerWidth <= 768 ? 'auto' : 'smooth'
    element.scrollIntoView({ behavior, block: 'start' })

    const deadline = Date.now() + SETTLE_MS
    let cancelled = false
    const cancel = () => {
        cancelled = true
    }

    // Only a deliberate input counts as taking over: the smooth scroll itself
    // fires plenty of scroll events, and once someone has grabbed the page,
    // moving it under them would be the worse bug.
    const listen = (add: boolean) => {
        const method = add ? window.addEventListener : window.removeEventListener
        method('wheel', cancel)
        method('touchstart', cancel)
        method('keydown', cancel)
    }
    listen(true)

    const correct = () => {
        if (cancelled) return
        if (Math.abs(element.getBoundingClientRect().top) > TOLERANCE) {
            element.scrollIntoView({ behavior: 'auto', block: 'start' })
        }
    }

    /*
     * Correct only once the page has stopped moving on its own.
     *
     * The smooth scroll takes most of a second, and for all of it the target is
     * a long way from where it is headed. Checking on a timer without asking
     * whether the animation is still running meant every check "corrected" it —
     * a dozen instant jumps fighting the browser's own animation, which is what
     * made clicking a tab stutter four or five times before arriving.
     *
     * So watch the scroll position instead of the clock: two consecutive checks
     * at the same offset mean the browser has finished, and only then is being
     * off by more than a few pixels something to fix.
     */
    let previousOffset = window.scrollY
    let stillChecks = 0
    let running = false

    const watch = (until: number) => {
        if (running) return
        running = true

        const step = () => {
            if (cancelled) {
                running = false
                return listen(false)
            }

            const offset = window.scrollY
            stillChecks = offset === previousOffset ? stillChecks + 1 : 0
            previousOffset = offset

            if (stillChecks >= 2) {
                correct()
                previousOffset = window.scrollY
                stillChecks = 0
            }

            if (Date.now() < until) setTimeout(step, CHECK_MS)
            else {
                running = false
                listen(false)
            }
        }
        setTimeout(step, CHECK_MS)
    }

    watch(deadline)

    // A slow image can land after that window closes, so take one more look
    // when `load` says the page has finished arriving. Through the same watcher
    // rather than correcting on the spot: `load` can land while the smooth
    // scroll is still running, and an instant correction then is precisely the
    // jump this is here to avoid.
    if (document.readyState !== 'complete') {
        window.addEventListener('load', () => watch(Date.now() + SETTLE_MS), { once: true })
    }
}
