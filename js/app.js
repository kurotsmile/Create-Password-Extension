
var sel_menu=0;

//Option Password
var p_length=8;
var p_upper=1;
var p_lower=1;
var p_number=0;
var p_special=0;
var p_pass="";

$(function () {
    ce.onLoad();
    ce.extension_id="ndhnlbbbdmmepbechjapigogodaggbop";

    chrome.storage.local.get('lang_app', function (result) {
        if(result.lang_app!=null){
            ce.lang=result.lang_app['lang'];
        };
    });

    ce.get_list_app_other();

    chrome.storage.local.get('save_setting', function (result) {
        if(result.save_setting){
            p_length=result.save_setting["p_length"];
            p_upper=result.save_setting["p_upper"];
            p_lower=result.save_setting["p_lower"];
            p_number=result.save_setting["p_number"];
            p_special=result.save_setting["p_special"];
            show_main();
        }else{
            show_main();
        }
    });
    
   
    $("#footer-donation").html(ce.donation_html());
});

function show_menu(){
    $("#app_menu").html("");
    var m_home=$('<a class="btn btn-sm p-1 '+(sel_menu===0 ? "btn-dark" : 0)+'"><i class="fa fa-rocket" aria-hidden="true"></i> Create new</a>');
    $(m_home).click(()=>{show_main();});
    var m_list=$('<a class="btn btn-sm p-1 '+(sel_menu===1 ? "btn-dark" : 1)+'"><i class="fa fa-key" aria-hidden="true"></i> Password</a>');
    $(m_list).click(()=>{show_list_password();});
    var m_rate=$('<a class="btn btn-sm p-1"><i class="fa fa-star" aria-hidden="true"></i> Rate</a>');
    $(m_rate).click(()=>{ce.rate();});
    $("#app_menu").append(m_home);
    $("#app_menu").append(m_list);
    $("#app_menu").append(m_rate);
}


function show_main(){
    sel_menu=0;
    $("#body_main").html('');
    var frm_create=$(`
        <div class="pricing-header px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
            <p class="lead">Password generated automatically for you</p>
        </div>

        <form class="mb-3">
            <div class="form-group">
                <div class="input-group mb-3">
                <code class="rounded bg-info p-3 text-white w-100 font-weight-bold m-2" id="txt_show_password">${randomPassword(p_length,p_upper,p_lower,p_number,p_special)}</code>
                <div class="d-block w-100 text-center">
                    <button class="btn btn-outline-secondary" type="button" id="btn_copy_pw"><i class="fas fa-copy"></i></button>
                    <button class="btn btn-outline-secondary" type="button" id="btn_new_pw"><i class="fas fa-sync-alt"></i></button>
                </div>
                </div>
            </div>

            <div class="form-group">
                <label for="inp_save_tag">Length Password</label>
                <div class="text-center" id="label_password_length_show">${p_length}</div>
                <input type="range" class="form-control" id="inp_password_length" aria-describedby="inp_save_tag_tip" value="${p_length}"  min="5" max="100">
                <small id="inp_save_tag_tip" class="form-text text-muted">Set password length</small>
            </div>

            <div class="form-group">
                <label for="advance_setting">Advance setting</label>
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="option_1" id="check_password_upper">
                    <label class="form-check-label" for="check_password_upper">Contains uppercase characters</label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="option_2" id="check_password_lower">
                    <label class="form-check-label" for="check_password_lower">Contains lowercase characters</label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="option_3" id="check_password_number">
                    <label class="form-check-label" for="check_password_number">Contains numbers</label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="option_4" id="check_password_special">
                    <label class="form-check-label" for="check_password_special">Contains special characters</label>
                </div>
                <small id="advance_setting_tip" class="form-text text-muted">Choose the password options that are appropriate for the site you are registering for.</small>
            </div>

            <div class="form-group">
                <label for="inp_save_tag">Save tag name password</label>
                <input type="text" class="form-control form-control-sm" id="inp_save_tag" aria-describedby="inp_save_tag_tip" placeholder="Enter Tag here...">
                <small id="inp_save_tag_tip" class="form-text text-muted">Add tags to group by collection</small>
            </div>

            <div class="form-group">
                <label for="save_username">Save Username</label>
                <input type="text" class="form-control form-control-sm" id="save_username" aria-describedby="save_username_tip" placeholder="Enter Username here...">
                <small id="save_username_tip" class="form-text text-muted">Add a login name to save with your password</small>
            </div>

            <div class="form-group text-center">
                <button id="btn_save" class="btn btn-success btn-lg"><i class="fas fa-save"></i> Save and Copy password</button>
            </div>

        </form>
    `);

    var inp_save_tag=$(frm_create).find("#inp_save_tag");
    var inp_save_username=$(frm_create).find("#save_username");
    var inp_password_length=$(frm_create).find("#inp_password_length");
    var btn_copy_pw=$(frm_create).find("#btn_copy_pw");
    var btn_new_pw=$(frm_create).find("#btn_new_pw");
    $(inp_password_length).change(function(){
        create_password();
        $("#label_password_length_show").html($("#inp_password_length").val());
    });

    $(btn_copy_pw).click(function(){
        var s_cp=$("#txt_show_password").html();
        ce.copy(s_cp,true);
    });

    $(btn_new_pw).click(function(){
        create_password();
    });
    
    $("#body_main").append(frm_create);
    

    var check_password_upper=$(frm_create).find("#check_password_upper");
    if(p_upper==1) $(check_password_upper).attr("checked","true");
    $(check_password_upper).click(()=>{
        create_password();
    });

    var check_password_lower=$(frm_create).find("#check_password_lower");
    if(p_lower==1) $(check_password_lower).attr("checked","true");
    $(check_password_lower).click(()=>{
        create_password();
    });

    var check_password_number=$(frm_create).find("#check_password_number");
    if(p_number!=-1) $(check_password_number).attr("checked","true");
    $(check_password_number).click(()=>{
        create_password();
    });

    var check_password_special=$(frm_create).find("#check_password_special");
    if(p_special!=-1) $(check_password_special).attr("checked","true");
    $(check_password_special).click(()=>{
        create_password();
    });

    var btn_save=$(frm_create).find("#btn_save");
    $(btn_save).click(()=>{
        chrome.storage.local.get({list_password: []}, function (result) {
            var data_password = result.list_password;
            s_pass=$("#txt_show_password").html();
            data_password.push({'password': s_pass,'tag': $(inp_save_tag).val(),'username':$(inp_save_username).val()});
            chrome.storage.local.set({list_password: data_password}, function () {
                ce.copy(s_pass,true);
                show_list_password();
            });
        });
        return false;
    });
    show_menu();
}

function delete_password(i){
    var index_delete=parseInt(i);
    chrome.storage.local.get('list_password', function (result) {
        var data_p=result.list_password;
        data_p.splice(index_delete,1);
        chrome.storage.local.set({list_password: data_p}, function () {
            show_list_password();
        });
    });
}


function  show_list_password() {
    sel_menu=1;
    chrome.storage.local.get('list_password', function (result) {
        $("#body_main").html("");
        show_menu();

        var html='Your password list<div class="table-responsive-md">';
        html+='<table class="table table-striped table-hover table-sm"><tbody id="all_item"></tbody></table>';
        html+='</div>';
        $("#body_main").html(html);
        var data_p=result.list_password;
        if(data_p){
            if(data_p.length>0){
                for(var i=data_p.length-1;i>=0;i--){
                    let index_item=i;
                    let s_pass=data_p[index_item].password;
                    let s_tag='';
                    let s_ussername='';
                    if(data_p[i].tag)
                        s_tag='<i class="fas fa-tag"></i> '+data_p[i].tag;
                    else
                        s_tag='<i class="fas fa-tag"></i> Password ('+i+')';

                    if(data_p[i].username) s_ussername='<i class="fas fa-user-tag"></i> '+data_p[i].username;

                    let item_p=$('<tr><td><b>'+s_tag+'</b> '+s_ussername+'<br/><small>'+data_p[i].password+'</small></td><td><button class="btn btn-sm btn-info btn_copy m-1"><i class="fas fa-copy"></i></button><button class="btn btn-sm btn-danger btn_del m-1"><i class="fas fa-backspace"></i></button></td></tr>');
                    let btn_del=$(item_p).find(".btn_del");
                    $(btn_del).click(function(){
                        delete_password(index_item);
                    });

                    let btn_cp=$(item_p).find(".btn_copy");
                    $(btn_cp).click(function(){
                        ce.copy(s_pass,true);
                    });
                    $("#all_item").append(item_p);
                }
            }else{
                $("#body_main").html(none_item());
            }
            
        }else{
            $("#body_main").html(none_item());
        }
    });
}

function none_item(){
    var html='<div class="text-center">';
    html+='<img src="images/none.gif"/><br/>';
    html+='No passwords have been stored yet';
    html+='</div>';
    return html;
}

function randomPassword(len = 8, minUpper = 0, minLower = 0, minNumber = -1, minSpecial = -1) {
    let chars = String.fromCharCode(...Array(127).keys()).slice(33),//chars
        A2Z = String.fromCharCode(...Array(91).keys()).slice(65),//A-Z
        a2z = String.fromCharCode(...Array(123).keys()).slice(97),//a-z
        zero2nine = String.fromCharCode(...Array(58).keys()).slice(48),//0-9
        specials = chars.replace(/\w/g, '')
    if (minSpecial < 0) chars = zero2nine + A2Z + a2z
    if (minNumber < 0) chars = chars.replace(zero2nine, '')
    let minRequired = minSpecial + minUpper + minLower + minNumber
    let rs = [].concat(
        Array.from({length: minSpecial ? minSpecial : 0}, () => specials[Math.floor(Math.random() * specials.length)]),
        Array.from({length: minUpper ? minUpper : 0}, () => A2Z[Math.floor(Math.random() * A2Z.length)]),
        Array.from({length: minLower ? minLower : 0}, () => a2z[Math.floor(Math.random() * a2z.length)]),
        Array.from({length: minNumber ? minNumber : 0}, () => zero2nine[Math.floor(Math.random() * zero2nine.length)]),
        Array.from({length: Math.max(len, minRequired) - (minRequired ? minRequired : 0)}, () => chars[Math.floor(Math.random() * chars.length)]),
    )
    return rs.sort(() => Math.random() > Math.random()).join('')
}


function create_password(){
    var check_password_upper=$('#check_password_upper').is(':checked') ? 1 : 0;
    var check_password_lower=$('#check_password_lower').is(':checked') ? 1 : 0;
    var check_password_number=$('#check_password_number').is(':checked') ? 1 : -1;
    var check_password_special=$('#check_password_special').is(':checked') ? 1: -1;
    var inp_password_length=parseInt($('#inp_password_length').val());
    p_pass=randomPassword(inp_password_length,check_password_upper,check_password_lower,check_password_number,check_password_special);
    $('#txt_show_password').stop(true,true).fadeOut();
    $('#txt_show_password').stop(true,true).fadeIn();
    $('#txt_show_password').fadeOut().fadeOut(100).fadeIn(300).fadeIn();
    $('#txt_show_password').html(p_pass);

    var obj_save={};
    obj_save["p_upper"]=check_password_upper;
    obj_save["p_lower"]=check_password_lower;
    obj_save["p_number"]=check_password_number;
    obj_save["p_special"]=check_password_special;
    obj_save["p_length"]=inp_password_length;

    chrome.storage.local.set({"save_setting": obj_save}, function () {
        console.log("save setting success");
    });

}
