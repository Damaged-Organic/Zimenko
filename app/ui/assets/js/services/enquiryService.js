class EnquiryService{

    send(url, data){

        return new Promise((resolve, reject) => {

            $.ajax({
                url: url,
                method: 'POST',
                data: data
            })
            .done((response) => {
                resolve(response);
            })
            .fail((err) => {
                err = JSON.parse(err.responseText);

                reject(err);
            });

        });
    }

}

export default EnquiryService;