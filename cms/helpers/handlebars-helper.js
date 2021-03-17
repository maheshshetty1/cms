const moment = require('moment');
module.exports = {

    select: function (selected, options) {
        return options.fn(this).replace(new RegExp('value=\"' + selected + '\"'), '$&selected="selected"');
        console.log('it works ' + selected);
    },

    dateModifier: function (date, format) {
        return moment(date, true).local().format(format);
    },

    paginate: function (options) {
        let output = '';
        let current = options.hash.current;
        let pages = options.hash.pages;
        let index=0;

        if (pages > 0) {
            if (current === 1) {
                output += `<li class="page-item disabled"><a class="page-link">First</a></li>`;
            } else {
                output += `<li class="page-item enabled"><a href="?page=1" class="page-link">First</a></li>`
            }



            if (current < 5) {

                for (index = 1; (index <= 5 && index <= pages); index++) {

                    if (index == current) {
                        output += `<li class="page-item active"><a class="page-link">${index}</a></li>`;
                    } else {
                        output += `<li class="page-item enabled"><a href="?page=${index}" class="page-link">${index}</a></li>`
                    }


                }
                output += `<li class="page-item"><a  class="page-link">...</a></li>`
            }

            if (current >= 5) {
                let length = current;
                let shift = 0;
                if (current > 5) {
                    if(current >= 7 ){
                        output += `<li class="page-item"><a  class="page-link">...</a></li>`
                    }
                    if (current % 5 === 0) {
                        length = current + 5;
                    }
                    while ((length % 5) != 0) {
                        length = length + 1;
                    }

                } else {
                    shift = 1;
                    length = 10;
                }

                for (index = (current-5)+shift; (index <= length && index <= pages); index++) {

                    if (index == current) {
                        output += `<li class="page-item active"><a class="page-link">${index}</a></li>`;
                    } else {
                        output += `<li class="page-item enabled"><a href="?page=${index}" class="page-link">${index}</a></li>`
                    }

                }

                if(current < pages-5){
                    output += `<li class="page-item"><a  class="page-link">...</a></li>` 
                }
            }

            if(current === pages){
                    output += `<li class="page-item disabled"><a class="page-link">Last</a></li>` 
            } else {
                output += `<li class="page-item enabled"><a href="?page=${pages}" class="page-link">Last</a></li>` 
            }


        }



        return output;

    }


};