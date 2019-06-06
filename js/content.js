window.addEventListener('load', (event) => {
	setInterval(() => {
		const channelSendCheckbox = document.querySelector('input[class$="broadcast_checkbox"]');
		if (!channelSendCheckbox) {
			// There's no "also send to channel" checkbox on the page.
			return;
		}

		if (channelSendCheckbox.dataset['__initiallyChecked']) {
			// We already set this to checked; we don't want to modify it again in case the user
			// manually cleared the check.
			return;
		}

		channelSendCheckbox.checked = true;
		channelSendCheckbox.dataset['__initiallyChecked'] = true;
	}, 500);
});