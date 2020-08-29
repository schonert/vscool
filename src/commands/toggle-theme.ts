import * as vscode from "vscode";

type Themes = string[];

/**
 * The ID of this extension as configured in the package.json.
 */
export const EXT_ID = "vscool";
/**
 * The ID of the switch command as configured in the package.json.
 */
export const COMMAND_SWITCH = `${EXT_ID}.toggleTheme`;

/**
 * The name of the vscode theme settings property.
 */
const SETTING_THEME = "workbench.colorTheme";

const COMMAND_SETTING_KEY = `${COMMAND_SWITCH}.themes`;

/**
 * Retrieves and returns the currently active theme from vscode settings.
 */
const current = () => {
	return vscode.workspace.getConfiguration().get<string>(SETTING_THEME);
};

/**
 * Retrieves and returns the currently active theme from vscode settings.
 */
const themes = () => {
	return (
		vscode.workspace.getConfiguration().get<Themes>(COMMAND_SETTING_KEY) || []
	);
};

/**
 * Retrieves and returns the theme, which should be activated next.
 * If the current theme is light, returns the dark theme and vice-versa.
 */
const nextTheme = (): string | undefined => {
	const allThemes = themes();
	const currentTheme = current();
	const currentThemeIndex = currentTheme ? allThemes.indexOf(currentTheme) : -1;
	const nextThemeIndex = currentThemeIndex + 1;

	// Not found
	if (currentThemeIndex === -1) {
		return allThemes[0];

		// Last theme
	} else if (currentThemeIndex === allThemes.length - 1) {
		return allThemes[0];
	}

	return allThemes[nextThemeIndex];
};

/**
 * Sets the global color theme setting with the given value.
 *
 * @param theme The theme which should be activated.
 */
const setTheme = (theme: string): void => {
	vscode.workspace
		.getConfiguration()
		.update(SETTING_THEME, theme, vscode.ConfigurationTarget.Global);
};

export default vscode.commands.registerCommand(COMMAND_SWITCH, () => {
	const theme = nextTheme();

	if (!theme) {
		vscode.window.showInformationMessage(`No theme found!
            Make sure to add them to ${COMMAND_SWITCH}
        `);
	} else {
		vscode.window.showInformationMessage(`Switching to ${theme}`);
		setTheme(theme);
	}
});
