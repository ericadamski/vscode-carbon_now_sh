'use strict';

import {
    Range,
    ExtensionContext,
    commands,
    window,
    TextDocument,
    Uri,
    workspace,
} from 'vscode';
import { open } from 'openurl2';
import { URL } from 'url';

function getLanguage(languageId: string) {
    const languageMap = new Map([
        ['c', 'text/x-csrc'],
        ['csharp', 'text/x-csharp'],
        ['cpp', 'text/x-c++src'],
        ['diff', 'text/x-diff'],
        ['fsharp', 'mllike'],
        ['html', 'htmlmixed'],
        ['java', 'text/x-java'],
        ['javascriptreact', 'jsx'],
        ['json', 'application/json'],
        ['objective-c', 'text/x-objectivec'],
        ['php', 'text/x-php'],
        ['plaintext', 'text'],
        ['shellscript', 'application/x-sh'],
    ]);

    if (languageMap.has(languageId)) {
        return languageMap.get(languageId);
    }

    return languageId;
}

export function activate(context: ExtensionContext) {
    const disposable = commands.registerCommand('carbon.show', () => {
        const editor = window.activeTextEditor;

        if (!editor) return window.showErrorMessage('😱 Feed me code!');

        const { languageId, lineAt, getText } = editor.document;
        const settings = workspace.getConfiguration('carbon');
        const language = getLanguage(languageId);

        const url = new URL(settings.get('url'));

        url.searchParams.set('bg', settings.get('backgroundColor'));
        url.searchParams.set('t', settings.get('theme'));
        url.searchParams.set('l', language);
        url.searchParams.set('ds', settings.get('dropShadow'));
        url.searchParams.set('wc', settings.get('windowControls'));
        url.searchParams.set('wa', settings.get('autoAdjustWidth'));
        url.searchParams.set('pv', `${settings.get('paddingVertical')}px`);
        url.searchParams.set('ph', `${settings.get('paddingHorizontal')}px`);
        url.searchParams.set('ln', settings.get('lineNumbers'));
        url.searchParams.set('f', settings.get('fontFamily'));
        url.searchParams.set('fs', `${settings.get('fontSize')}px`);

        const { start, end, active } = editor.selection;

        const selection = (start.isEqual(end)
            ? lineAt(active.line).text
            : getText(new Range(start, end))
        ).trim();

        const maxCharacterLength = 1000;
        if (selection.length > maxCharacterLength)
            return window.showErrorMessage(
                `Selected code is longer than ${maxCharacterLength} characters, refusing to send to carbon.`
            );

        url.searchParams.set('code', selection);

        open(
            url,
            err =>
                err &&
                window.showErrorMessage(
                    'There was an issue sending code to carbon. Please try again.'
                )
        );
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
