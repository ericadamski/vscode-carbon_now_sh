'use strict';

import { ExtensionContext, commands, window, TextDocument, Uri } from 'vscode';
import { open } from 'openurl';

export function activate(context: ExtensionContext) {
    const disposable = commands.registerCommand('carbon.show', () => {
        const editor = window.activeTextEditor;

        if (!editor) return window.showErrorMessage('😱 Feed me code!');

        const { getText, languageId } = editor.document;

        const url = `https://carbon.now.sh/?bg=rgba(0,0,0,0)&t=dracula&l=${languageId}&ds=true&wc=true&wa=true&pv=43px&ph=57px&ln=false&code=${encodeURI(getText())}`;
        
        open(url);
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {
}