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
		// In the "Threads" view, if there's also a thread open on the side, there may be
		// multiple "Also send to channel" checkboxes, so we'll use querySelectorAll.
		// Note that this selector is just reverse-engineered from looking at the DOM. It
		// might be fragile.
		const channelSendCheckboxes = document.querySelectorAll('input[data-qa$="_broadcast_checkbox"]');

		for (let i = 0; i < channelSendCheckboxes.length; i++) {
			if (channelSendCheckboxes[i].checked) {
				// Skip all the other checks and data accesses
				continue;
			}

			if (channelSendCheckboxes[i].dataset['__stopChecking']) {
				// The user has interacted with the checkbox and we should no longer mess with it
				continue;
			}

			// We need to use click() instead of checked=true because otherwise Slack just ignores it
			channelSendCheckboxes[i].click();

			// Checking that the listener hasn't already been added is redundant, since
			// addEventListener won't add the same listener twice, but...
			if (!channelSendCheckboxes[i].dataset['__realClickListenerAdded']) {
				channelSendCheckboxes[i].addEventListener('click', realClickListener);
				channelSendCheckboxes[i].dataset['__realClickListenerAdded'] = true;
			}
		}
	}, 1000);
});