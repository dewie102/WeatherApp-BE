const nationalalertsBaseURL = "https://api.weather.gov/alerts/active";

exports.nationalAlerts_top_active_alerts = async (req, res) => {
  let { count } = req.query;

  if (!count) {
    count = 10;
  }

  const response = await getTopActiveResults();

  if (!Object.hasOwn(response, "features")) {
    res.status(400).json({
      error: `Can't find features, something has gone wrong:\n${response}`,
    });
  }

  const limited = limitResults(response.features, count);
  const result = formatForFrontend(limited);
  res.send(result);
};

async function getTopActiveResults() {
  const response = await fetch(`${nationalalertsBaseURL}`);

  const content = await response.json();
  return content;
}

function limitResults(features, count) {
  let results = features.slice(0, count);
  return results;
}

function formatForFrontend(dataset) {
  let result = [];
  dataset.forEach((datapoint) => {
    const properties = datapoint.properties;
    let temp = {
      alertType: properties.event,
      effective: properties.effective,
      expires: properties.expires,
      severity: properties.severity,
      headline: properties.headline,
      description: properties.description,
      areaDescription: properties.areaDesc,
    };

    result.push(temp);
  });

  return result;
}
