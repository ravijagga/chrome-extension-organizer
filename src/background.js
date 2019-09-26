import uuid from 'uuid';
import config from './config';
import {
	getAllExtensions,
	getExtensionsCategoryMapping,
	setExtensionsCategoryMapping
} from './commonFunctions';

function setGroups() {
	return getAllExtensions().then(extensions => {
		const groups = [
			{
				name: 'Uncategorized',
				id: uuid(),
				extensions: extensions.map(({ name, id }) => ({ name, id }))
			}
		];

		return setExtensionsCategoryMapping(groups);
	});
}

function createInitialGroups() {
	console.log('fired');

	return getExtensionsCategoryMapping()
		.then(categories => {
			if (config.RESET_CATEGORY_MAPPING) return setGroups();
		})
		.catch(err => {
			console.log(err);
			return setGroups();
		});
}

chrome.runtime.onInstalled.addListener(createInitialGroups);
chrome.runtime.onStartup.addListener(createInitialGroups);
