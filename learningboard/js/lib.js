$.getCSS = function(url){
  $('head').append($('<link rel="stylesheet" type="text/css" />').attr('href', url));
};

$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

$.getLevelName = function(level_num)
{
    switch (level_num)
    {
        case 0: return "Beginner"
        case 1: return "Intermediate"
        case 2: return "Advanced"
    }
}

serv_addr = "http://127.0.0.1:8000"
