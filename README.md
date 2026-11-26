# XINSTA

Scroll X (x.com) like Instagram Reels: one post per screen, centred, with snap scrolling and keyboard control.

## Features

- One post per screen with snap scrolling, on any timeline: For you, Following, lists, profiles and search.
- The sidebars, the top bar and the Grok and Messages panels are hidden while Reels mode is on.
- The post in view is highlighted, and only its video plays.
- Pages without posts (Messages, Settings) scroll normally; snapping only applies where there are posts.
- Follows X's page changes, so it keeps working as you move between timelines, profiles and posts.
- Long posts start at the top, so you can still read to the end.
- Works with X's own infinite timeline. Nothing is fetched or sent anywhere.
- No permissions, no tracking, no network requests. The only thing stored is whether Reels mode is on.

## Install

1. Download or clone this folder.
2. Open `chrome://extensions` (or `brave://extensions`, `edge://extensions`).
3. Turn on **Developer mode** and click **Load unpacked**, then choose the folder.
4. Open x.com and press **R**, or click **Reels** in the bottom-left corner.

## Keys

| Key | Action |
| --- | --- |
| `↓`, `Space`, `J` | Next post |
| `↑`, `Shift+Space`, `K` | Previous post |
| `L` | Like or unlike the post in view |
| `M` | Mute or unmute the video in view |
| `O` | Open the post in view |
| `R` | Turn Reels mode on or off |

## How it works

A content script marks each timeline cell that holds a post, and CSS makes those cells full height with scroll snapping. X still renders and loads the timeline itself, so the extension keeps working as you scroll.

## License

MIT
