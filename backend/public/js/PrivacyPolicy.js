// Assuming you have the data fetched from your server or TinyMCE
document.addEventListener('DOMContentLoaded', () => {
  fetch(`https://dagstechnology.in/admin/api/fetchMisc`)
    .then(response => response.json())
    .then(data => {
      if (data && data.charges && data.charges.privacyPolicy) {
        // Clean up the data
        let rawData = data.charges.privacyPolicy.replace(/\|\|/g, "<br>").replace(/\s+/g, ' ').trim();

        // Beautify the HTML content
        let beautifiedData = html_beautify(rawData, {
          indent_size: 2,
          space_in_empty_paren: true
        });

        document.getElementById('privacyPolicy').innerHTML = beautifiedData;
      } else {
        console.error('Invalid data structure:', data);
      }
    })
    .catch(error => console.error('Error fetching data:', error));
});
