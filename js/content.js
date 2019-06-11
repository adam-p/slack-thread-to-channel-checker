/*
	Slack behaviour notes:
	- The checkbox starts out unchecked
	- Every time a message is sent, the checkbox is cleared
	- Setting the `checked` attribute of the checkbox element isn't enough --
		the element's `click()` method must be called.
*/

function realClickListener(event) {
	if (event instanceof MouseEvent && event.isTrusted) {
		// The user clicked the checkbox and we should no longer force its value
		this.dataset['__stopChecking'] = true;
	}
}

window.addEventListener('load', (event) => {
	setInterval(() => {
		const channelSendCheckbox = document.querySelector('input[class$="broadcast_checkbox"]');
		if (!channelSendCheckbox) {
			// There's no "also send to channel" checkbox on the page.
			return;
		}

		if (channelSendCheckbox.checked) {
			// Skip all the other checks and data accesses
			return;
		}

		if (channelSendCheckbox.dataset['__stopChecking']) {
			// The user has interacted with the checkbox and we should no longer mess with it
			return;
		}

		// We need to use click() instead of checked=true because otherwise Slack just ignores it
		channelSendCheckbox.click();

		// Checking that the listener hasn't already been added is redundant, since
		// addEventListener won't add the same listener twice, but...
		if (!channelSendCheckbox.dataset['__realClickListenerAdded']) {
			channelSendCheckbox.addEventListener('click', realClickListener);
			channelSendCheckbox.dataset['__realClickListenerAdded'] = true;
		}
	}, 500);
});