---
---
var allChannels = document.getElementById("detectorAllChannels");
var channel = document.getElementById("detectorChannel");
var alertPin = document.getElementById("alertPin");
var invert = document.getElementById("invertAlertPin");
var scanTime = document.getElementById("detectorScanTime");
var saveStatus = getE('spinner-container');
var res;

getResponse("settings.json", function(responseText) {
	try {
		res = JSON.parse(responseText);
		log("RESPONSE  ~ ", res,  true)
	} catch(err) {
		log("INVALID   ~ ", responseText, false)
		console.error(err)
		notify("{% t errors.E25 %} (E25)");
		return
	}
	if (res.detectorAllChannels == 1) { allChannels.checked = true;
		switchChannel() } else { allChannels.checked = false;
		switchChannel() }
	channel.value = res.detectorChannel;
	alertPin.value = res.alertPin;
	if (res.invertAlertPin == 1) { invert.checked = true } else { invert.checked = false }
	scanTime.value = res.detectorScanTime;
});

allChannels.addEventListener("change", switchChannel, false);

function switchChannel() {
	var isChecked = allChannels.checked;
	if (isChecked) {
		channelContainer.classList.add("disabled");
	} else {
		channelContainer.classList.remove("disabled");
	}
}

function saveSettings(run) {
	saveStatus.className = "";
	showLoading();
	var url = "settingsSave.json";
	url += "?detectorAllChannels=" + allChannels.checked;
	url += "&detectorChannel=" + channel.value;
	url += "&alertPin=" + alertPin.value;
	url += "&invertAlertPin=" + invert.checked;
	invert.checked
	url += "&detectorScanTime=" + scanTime.value;

	getResponse(url, function(responseText) {
		if (responseText == "true") {
			if (run == true) {
				getResponse("detectorStart.json", function(responseText) {
					if (responseText == "true") {
						showLoading("hide");
						indicate(true)
						notify("{% t detector.strings.A %}");
						var card = document.getElementsByClassName("card-content")[0];
						card.className = "card-content disabled"
					} else {
						notify("{% t errors.E30 %} (E30)");
						indicate()
					}
				}, function() {
					notify("{% t errors.E31 %} (E31)");
					indicate()
				});
			} else {
				saveStatus.classList.add("success-save");
			}
		} else {
			if (run == false) saveStatus.classList.add("failed-save");
			notify("{% t errors.E32 %} (E32)");
			indicate()
		}
	}, function() {
		if (run == false) saveStatus.classList.add("failed-save");
		notify("{% t errors.E33 %} (E33)");
		indicate()
	});
}
fadeIn();