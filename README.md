# carbon-now-sh

A VS Code extension to open the current editor content in [carbon.now.sh](https://carbon.now.sh).

Simply highlight the code you want to capture, and run the Carbon extension. You'll be redirected to [carbon.now.sh](https://carbon.now.sh) with your selected code populating the textarea. 

## Running the Extension
There are two ways to run the carbon-now-sh extension. 

* `Alt+Cmd+A` or (`Alt+Windows+A` on Windows) - a shortcut key that will instantly launches the extension
* Open the Command Pallete (`Cmd+Shift+P` or `Ctrl+Shift+P` on Windows), and type Carbon. 

## Overriding Carbon Options
In your VSCode settings, you can override the carbon defaults using these settings:

```json
{
    "carbon.backgroundColor": "rgba(0,0,0,0)",
    "carbon.theme": "seti",
    "carbon.dropShadow": true,
    "carbon.windowControls": true,
    "carbon.autoAdjustWidth": true,
    "carbon.paddingVertical": 24,
    "carbon.paddingHorizontal": 16,
    "carbon.lineNumbers": false,
    "carbon.fontFamily": "Hack",
    "carbon.fontSize": 13
}
```
