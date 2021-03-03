//return date string in YYYY-MM-DD format
const getDateString = date =>
    `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

const displayPicture = (data, dest) => {
    console.log(data)
    let html = "";
    if(data.error) {      // error - display message
        html += `<span class="error">${data.error.message}e/span>`;
    }
    else if (data.code) {  // problem - display message
        html += `<span class="error">${data.msg}</span`;
    }
    else {                  // sucesss display image/video data

        if (!data.hasOwnProperty('media_type')){
            data.media_type = "image"
        }
        const width = 500;
        switch (data.media_type) {
            case "image":
                html += `<img src="${data.url}" width=${width} alt="NASA photo.jpg">`;
                break;
            case "video":
                html += `<iframe src=${data.url} frameborder="0" allowfullscreen></iframe>`;
                break;
            default:
                html += `<img src="notavailable.png" width="$(width)" alt="NASA photo.jpg">`;
        }

        if (data.url.includes('picsum')) {
            html += `<div>Hopefully this isn't space :)</div>`;
        } else {
            // date and copyright
            html += `<div>${data.date}`;
            if (data.copyright) {
                html += `<span class="right">&copy; ${data.copyright}</span>`;
            }
            html += "</div>";

            // explanation
            html += `<p>${data.explanation}</p>`;
        }

    }

    // display HTML
    $(dest).html(html);

};

const displayError = error => {
    let html = `<span class="error">${error.message}</span>`;
    $("#display").html(html);
};


$(document).ready(() => {
    const today = new Date();
    let dateStr = getDateString(today);

    const dateTextbox = $("#date");
    dateTextbox.val(dateStr);
    dateTextbox.focus();

    $("#view_button").click(() => {
        dateStr = $("#date").val();
        const dateObj = new Date(dateStr);

        if(dateObj == "Invalid Date") {
            const msg = "Please enter valid date in YYYY-MM-DD format."
            $("#display").html(`<span class="error">${msg}</span>`);
        }
        else {
            dateStr = getDateString(dateObj);

            // build URL for API request
            const domain = `https://api.nasa.gov/planetary/apod`;
            const request = `?api_key=DEMO_KEY&date=${dateStr}`;
            const url = domain + request;

            fetch(url)
                .then(response => response.json())
                .then(json => displayPicture(json, "#display"))
                .catch(e => displayError(e) );
        }
        $("#date").focus();
    });
    $("#pic_button").click(() => {
        const domain = `https://picsum.photos/200`;
        const request = ``;
        const url = domain + request;

        fetch(url)
            .then(response => response)
            .then(pic => displayPicture(pic, "#display2"))
            .catch(e => displayError(e));
    });
});