# Number Quest
A gentle, Duolingo-inspired math adventure for a seven-year-old, built with Phaser 3 and accessible HTML controls. No accounts, ads, timers, or lost lives.

## Play and develop
Requires Node.js 22 or newer.

```
npm install
npm run dev
npm test
npm run build
```

Four worlds, 12 lessons, six questions each: two-digit addition, two-digit subtraction, three-digit addition, and three-digit subtraction. Each world starts without carrying/borrowing, then introduces mixed practice. Subtraction answers are always nonnegative. Lessons earn 60 XP and 1–3 stars; mistakes offer unlimited retries. Earlier lessons can be replayed.

## Parent controls
Click **Parents** and enter **parent:Parent** (case-sensitive). Restore to any lesson, including locked lessons, or an exact saved snapshot. Jumping to a checkpoint marks earlier lessons with three stars and 60 XP each. The previous state is backed up before each restore. The last 20 completions/backups are retained.

Progress is stored only in localStorage on this browser/device. Clearing browser data removes it; devices do not synchronize. The passcode is a convenience gate for children, not authentication: static public source includes the code. No personal information is collected. Google Fonts is optional; system fonts work as fallback.

## GitHub Pages
Push this project to the `main` branch of `justfrnkntech/level7math`. In repository **Settings → Pages → Build and deployment**, choose **GitHub Actions**. The included workflow runs tests, builds, and deploys on each push to main. Expected URL after successful deployment: https://justfrnkntech.github.io/level7math/ . Relative build asset paths support the repository subpath.

## Bunny trail
The Phaser rabbit hops along six stepping stones as answers are solved, smiles for correct answers, and dances after a lesson. Every third lesson celebrates a world milestone with extra confetti. The home trail shows the saved 12-lesson journey and animates the next hop when returning from a newly completed lesson. The rabbit stays visible on mobile. Reduced-motion preferences replace hops and dances with immediate position and expression changes.

## Sounds
Use the music-note button in the header to mute or enable sound; the preference is remembered on this browser. Correct answers play a chime, retries a soft boop, lesson dances a musical flourish, and world milestones a gentle synthesized horn fanfare. Audio starts only after interaction, stops when muted or the page is hidden, and requires no external sound downloads. Unavailable audio does not prevent gameplay.
