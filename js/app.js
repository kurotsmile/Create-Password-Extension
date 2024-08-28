class App{

    sel_menu=0;
    type_encryption=0;
    
    //Option Password
    p_length=8;
    p_upper=1;
    p_lower=1;
    p_number=0;
    p_special=0;
    p_pass="";

    onLoad(){
        chrome.storage.local.get('lang_app', function (result) {
            if(result.lang_app!=null){
                ce.lang=result.lang_app['lang'];
            };
        });
    
        ce.get_list_app_other();
    
        chrome.storage.local.get('save_setting', function (result) {
            if(result.save_setting){
                app.p_length=result.save_setting["p_length"];
                app.p_upper=result.save_setting["p_upper"];
                app.p_lower=result.save_setting["p_lower"];
                app.p_number=result.save_setting["p_number"];
                app.p_special=result.save_setting["p_special"];
                app.type_encryption=result.save_setting["type_encryption"];
                app.sel_menu=result.save_setting["sel_menu"];
                if(app.sel_menu==0)
                    app.show_main();
                else if(app.sel_menu==1)
                    app.show_list_password();
                else if(app.sel_menu==2)
                    app.show_encryption();
                else
                    app.show_main();
            }else{
                app.show_main();
            }
        });
 
        $("#footer-donation").html(ce.donation_html());
    }

    show_menu(){
        $("#app_menu").html("");
        var m_home=$('<a class="btn m-1 btn-sm p-1 '+(app.sel_menu===0 ? "btn-dark" : 0)+'"><i class="fa fa-key" aria-hidden="true"></i> Create new</a>');
        $(m_home).click(()=>{app.show_main();});
        var m_list=$('<a class="btn m-1 btn-sm p-1 '+(app.sel_menu===1 ? "btn-dark" : 1)+'"><i class="fa fa-list" aria-hidden="true"></i> Password</a>');
        $(m_list).click(()=>{app.show_list_password();});
        var m_encryption=$('<a class="btn m-1 btn-sm p-1 '+(app.sel_menu===2 ? "btn-dark" : 1)+'"><i class="fab fa-mendeley"></i> Encryption</a>');
        $(m_encryption).click(()=>{app.show_encryption();});
        var m_rate=$('<a class="btn m-1 btn-sm p-1"><i class="fa fa-star" aria-hidden="true"></i> Rate</a>');
        $(m_rate).click(()=>{ce.rate();});
        $("#app_menu").append(m_home);
        $("#app_menu").append(m_list);
        $("#app_menu").append(m_encryption);
        $("#app_menu").append(m_rate);
    }


    show_main(){
        app.p_pass=app.escapeHtml(app.randomPassword(app.p_length,app.p_upper,app.p_lower,app.p_number,app.p_special));
        app.sel_menu=0;
        $("#body_main").html('');
        var frm_create=$(`
            <div class="pricing-header px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
                <p class="lead">Password generated automatically for you</p>
            </div>

            <form class="mb-3">
                <div class="form-group">
                    <div class="input-group mb-3">
                    <textarea class="form-control mb-2 text-white text-center" id="txt_show_password" rows="3" id="txt_show_password">${app.p_pass}</textarea>
                    <div class="d-block w-100 text-center">
                        <button class="btn btn-outline-secondary" type="button" id="btn_copy_pw"><i class="fas fa-copy"></i></button>
                        <button class="btn btn-outline-secondary" type="button" id="btn_new_pw"><i class="fas fa-sync-alt"></i></button>
                    </div>
                    </div>
                </div>

                <div class="form-group">
                    <label for="inp_save_tag">Length Password</label>
                    <div class="text-center" id="label_password_length_show">${app.p_length}</div>
                    <input type="range" class="form-control" id="inp_password_length" aria-describedby="inp_save_tag_tip" value="${app.p_length}"  min="5" max="100">
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
            app.create_password();
            $("#label_password_length_show").html($("#inp_password_length").val());
        });

        $(btn_copy_pw).click(function(){
            ce.copy(app.p_pass,true);
        });

        $(btn_new_pw).click(function(){
            app.create_password();
        });
        
        $("#body_main").append(frm_create);
        

        var check_password_upper=$(frm_create).find("#check_password_upper");
        if(app.p_upper==1) $(check_password_upper).attr("checked","true");
        $(check_password_upper).click(()=>{
            app.create_password();
        });

        var check_password_lower=$(frm_create).find("#check_password_lower");
        if(app.p_lower==1) $(check_password_lower).attr("checked","true");
        $(check_password_lower).click(()=>{
            app.create_password();
        });

        var check_password_number=$(frm_create).find("#check_password_number");
        if(app.p_number!=-1) $(check_password_number).attr("checked","true");
        $(check_password_number).click(()=>{
            app.create_password();
        });

        var check_password_special=$(frm_create).find("#check_password_special");
        if(app.p_special!=-1) $(check_password_special).attr("checked","true");
        $(check_password_special).click(()=>{
            app.create_password();
        });

        var btn_save=$(frm_create).find("#btn_save");
        $(btn_save).click(()=>{
            app.save_list(app.p_pass,$(inp_save_tag).val(),$(inp_save_username).val(),'0',()=>{
                ce.copy(app.p_pass,true);
                app.show_list_password();
            });
            return false;
        });
        app.show_menu();
    }

    show_encryption(){
        app.sel_menu=2;
        var html='';
        html+='<h6>Encryption</h6>';
        html+='<form>';
            html+='<div class="mb-3">';
                html+='<label for="exampleFormControlTextarea1" class="form-label">Enter the content you want to encrypt here</label>';
                html+='<textarea class="form-control" id="encryption_in" rows="3"></textarea>';
            html+='</div>';

            html+='<div class="mb-3">';
                html+='<button index-type="0" class="btn_sel_encryption btn btn-sm m-1 '+(app.type_encryption===0 ? "btn-dark" : "btn-light")+'"><i class="fas fa-dna"></i> Base64</button>';
                html+='<button index-type="1" class="btn_sel_encryption btn btn-sm m-1 '+(app.type_encryption===1 ? "btn-dark" : "btn-light")+'"><i class="fas fa-dna"></i> URL</button>';
                html+='<button index-type="2" class="btn_sel_encryption btn btn-sm m-1 '+(app.type_encryption===2 ? "btn-dark" : "btn-light")+'"><i class="fas fa-dna"></i> MD5</button>';
                html+='<button index-type="3" class="btn_sel_encryption btn btn-sm m-1 '+(app.type_encryption===3 ? "btn-dark" : "btn-light")+'"><i class="fas fa-dna"></i> SHA-256</button>';
                html+='<button index-type="4" class="btn_sel_encryption btn btn-sm m-1 '+(app.type_encryption===4 ? "btn-dark" : "btn-light")+'"><i class="fas fa-dna"></i> AES</button>';
                html+='<button index-type="5" class="btn_sel_encryption btn btn-sm m-1 '+(app.type_encryption===5 ? "btn-dark" : "btn-light")+'"><i class="fas fa-dna"></i> RIPEMD-160</button>';
                html+='<button index-type="6" class="btn_sel_encryption btn btn-sm m-1 '+(app.type_encryption===6 ? "btn-dark" : "btn-light")+'"><i class="fas fa-dna"></i> HMAC</button>';
                html+='<button index-type="7" class="btn_sel_encryption btn btn-sm m-1 '+(app.type_encryption===7 ? "btn-dark" : "btn-light")+'"><i class="fas fa-dna"></i> ROT13</button>';
                html+='<button index-type="8" class="btn_sel_encryption btn btn-sm m-1 '+(app.type_encryption===8 ? "btn-dark" : "btn-light")+'"><i class="fas fa-dna"></i> Caesar Cipher</button>';
                html+='<button index-type="9" class="btn_sel_encryption btn btn-sm m-1 '+(app.type_encryption===9 ? "btn-dark" : "btn-light")+'"><i class="fas fa-dna"></i> Rabbit</button>';
            html+='</div>';

            html+='<div class="mb-3">';
                html+='<label for="exampleFormControlTextarea1" class="form-label">Result</label>';
                html+='<textarea class="form-control" id="encryption_out" rows="3"></textarea>';
            html+='</div>';

            html+='<div class="mb-3">';
                html+='<button id="btn_save_encryptio" class="btn btn-success w-100"><i class="fas fa-save"></i> Save and Copy</button>';
            html+='</div>';

        html+='</form>';
        $("#body_main").html(html);
        app.show_menu();

        $(".btn_sel_encryption").click(function(){
            var index=$(this).attr("index-type");
            app.type_encryption=parseInt(index);
            $(".btn_sel_encryption").removeClass('btn-dark').addClass('btn-light');
            $(this).removeClass('btn-light').addClass('btn-dark');
            app.parse_encryption();
            app.save_setting();
            return false;
        });

        $("#encryption_in").change(function(){
            app.parse_encryption();
        });

        $("#btn_save_encryptio").click(function(){
            var val_encryption_in=$("#encryption_in").val();
            var val_encryption_out=$("#encryption_out").val();
            app.save_list(val_encryption_out,val_encryption_in,"Encryptio","1",()=>{
                ce.copy(val_encryption_out,true);
            });
            return false;
        });
    }

    parse_encryption(){
        var val_encryption=$("#encryption_in").val();
        var val_result='';
        if(app.type_encryption==0)
            val_result=CryptoJS.AES.encrypt(val_encryption,"password");
        else if(app.type_encryption==1)
            val_result=encodeURIComponent(val_encryption);
        else if(app.type_encryption==2)
            val_result=CryptoJS.MD5(val_encryption).toString();
        else if(app.type_encryption==3)
            val_result=CryptoJS.SHA256(val_encryption).toString();
        else if(app.type_encryption==4)
            val_result=CryptoJS.AES.encrypt(val_encryption, 'password').toString();
        else if(app.type_encryption==5)
            val_result=CryptoJS.RIPEMD160(val_encryption).toString();
        else if(app.type_encryption==6)
            val_result=CryptoJS.HmacSHA256(val_encryption, 'password').toString();
        else if(app.type_encryption==7)
            val_result=app.rot13(val_encryption);
        else if(app.type_encryption==8)
            val_result=app.caesarCipher(val_encryption,3);
        else if(app.type_encryption==9)
            val_result=CryptoJS.Rabbit.encrypt(val_encryption,"Secret Passphrase");
        $("#encryption_out").val(val_result);
    }

    rot13(str) {
        return str.replace(/[a-zA-Z]/g, function(c) {
            return String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
        });
    }

    caesarCipher(str, shift) {
        return str.replace(/[a-zA-Z]/g, function(c) {
            var code = c.charCodeAt(0);
            var lowerCaseStart = 97;
            var upperCaseStart = 65;
            var start = code >= lowerCaseStart ? lowerCaseStart : upperCaseStart;
            return String.fromCharCode(((code - start + shift) % 26) + start);
        });
    }

    delete_password(i){
        var index_delete=parseInt(i);
        chrome.storage.local.get('list_password', function (result) {
            var data_p=result.list_password;
            data_p.splice(index_delete,1);
            chrome.storage.local.set({list_password: data_p}, function () {
                app.show_list_password();
            });
        });
    }

    show_list_password() {
        app.sel_menu=1;
        chrome.storage.local.get('list_password', function (result) {
            $("#body_main").html("");
            app.show_menu();

            var html='<h6>Your password list</h6><div class="table-responsive-md">';
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
                        let s_icon_type='';

                        if(data_p[i].type=="1")
                            s_icon_type='<i class="fab fa-mendeley"></i> ';
                        else
                            s_icon_type='<i class="fa fa-key" aria-hidden="true"></i> ';

                        if(data_p[i].tag){
                            s_tag=s_icon_type+data_p[i].tag;
                        }
                        else{
                            if(data_p[i].type=="1")
                                s_tag=s_icon_type+' Encryption('+i+')';
                            else
                                s_tag=s_icon_type+' Password('+i+')';
                        }
                            
                        if(data_p[i].username) s_ussername='<i class="fas fa-user-tag"></i> '+data_p[i].username;

                        let item_p=$('<tr><td class="text-truncate-ellipsis"><b>'+s_tag+'</b> '+s_ussername+'<br/><small>'+data_p[i].password+'</small></td><td><button class="btn btn-sm btn-info btn_copy m-1"><i class="fas fa-copy"></i></button><button class="btn btn-sm btn-danger btn_del m-1"><i class="fas fa-backspace"></i></button></td></tr>');
                        let btn_del=$(item_p).find(".btn_del");
                        $(btn_del).click(function(){
                            app.delete_password(index_item);
                        });

                        let btn_cp=$(item_p).find(".btn_copy");
                        $(btn_cp).click(function(){
                            ce.copy(s_pass,true);
                        });
                        $("#all_item").append(item_p);
                    }
                }else{
                    $("#body_main").html(app.none_item());
                }
                
            }else{
                $("#body_main").html(app.none_item());
            }
        });
    }

    none_item(){
        var html='<div class="text-center">';
        html+='<img src="images/none.gif"/><br/>';
        html+='No passwords have been stored yet';
        html+='</div>';
        return html;
    }

    randomPassword(len = 8, minUpper = 0, minLower = 0, minNumber = -1, minSpecial = -1) {
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


    create_password(){
        app.p_upper=$('#check_password_upper').is(':checked') ? 1 : 0;
        app.p_lower=$('#check_password_lower').is(':checked') ? 1 : 0;
        app.p_number=$('#check_password_number').is(':checked') ? 1 : -1;
        app.p_special=$('#check_password_special').is(':checked') ? 1: -1;
        app.p_length=parseInt($('#inp_password_length').val());
        app.p_pass=app.randomPassword(app.p_length,app.p_upper,app.p_lower,app.p_number,app.p_special);
        $('#txt_show_password').stop(true,true).fadeOut();
        $('#txt_show_password').stop(true,true).fadeIn();
        $('#txt_show_password').fadeOut().fadeOut(100).fadeIn(300).fadeIn();
        $('#txt_show_password').val(app.escapeHtml(app.p_pass));

        app.save_setting();
    }

    save_setting(){
        var obj_save={};
        obj_save["p_upper"]=app.p_upper;
        obj_save["p_lower"]=app.p_lower;
        obj_save["p_number"]=app.p_number;
        obj_save["p_special"]=app.p_special;
        obj_save["p_length"]=app.p_length;
        obj_save["type_encryption"]=app.type_encryption;
        obj_save["sel_menu"]=app.sel_menu;

        chrome.storage.local.set({"save_setting": obj_save}, function () {
            console.log("save setting success");
        });
    }

    save_list(s_data,s_tag="",s_username="",s_type='0',act_done=null){
        chrome.storage.local.get({list_password: []}, function (result) {
            var data_password = result.list_password;
            data_password.push({'password': s_data,'tag':s_tag,'username':s_username,'type':s_type});
            chrome.storage.local.set({list_password: data_password}, function () {
                if(act_done) act_done();
            });
        });
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

var app=new App();

$(function () {
    ce.onLoad();
    ce.extension_id="ndhnlbbbdmmepbechjapigogodaggbop";
    app.onLoad();
});
