# For Maria 💌

A stage-by-stage YES / NO website (HTML + CSS + JavaScript, no frameworks).
Open `index.html` in a browser to try it.

## How her answers reach you

All settings are at the top of `script.js` (`CONFIG`).

| Way | What happens | Setup |
| --- | --- | --- |
| **ntfy (live, automatic)** | A phone notification for every single answer, plus a full summary at the end (or when she closes the page halfway). | Install the **ntfy** app (Play Store / App Store), tap **+**, subscribe to the topic `maria-newpage-fef74f3e82fe`. Done. |
| **WhatsApp button** | On the last page she taps "Send my answers to him on WhatsApp", which opens WhatsApp with all her answers written out to `+20 106 412 4272`. She presses send. | Nothing, it's already set. |
| **CallMeBot (optional, automatic WhatsApp)** | The full summary arrives on your WhatsApp by itself. | Follow the steps on callmebot.com ("Free API WhatsApp"): add their bot number, send it `I allow callmebot to send me messages`, then paste the key you get into `callmebotApiKey`. Their site said the free bot was full at the time of writing, so it may only work later. |

Test it yourself before sending her the link: go through the whole site once and check you got the notifications.

## Put it online (free)

GitHub repo → **Settings → Pages** → Source: *Deploy from a branch* → pick the branch and `/ (root)` → Save.
After a minute you get a link like `https://<your-username>.github.io/<repo-name>/`. Send her that.
