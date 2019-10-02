import config from './config';
import { getExtensionsCategoryMapping, resetGroups, updateGroups } from './commonFunctions';

function createInitialGroups() {
	return getExtensionsCategoryMapping()
		.then(categories =>
			!categories.length || (categories.length && config.RESET_CATEGORY_MAPPING)
				? resetGroups()
				: updateGroups(categories)
		)
		.catch(err => {
			console.log(err);
			return resetGroups();
		});
}

chrome.runtime.onInstalled.addListener(createInitialGroups);
chrome.runtime.onStartup.addListener(createInitialGroups);
