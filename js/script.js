$(document).ready(function(){
    $("#crush").change(function(){
        var $sel = $(this).val();
        $("result_.opt_01").text($sel);
    });

    $("#gram").change(function(){
        var $sel = $(this).val();
        $("result_.opt_02").text($sel);
    });

    var $str_price = $(".det_price span").text();
    var $num_price = parseFloat($str_price.replace(",",""));

    var $total = 0; //총금액의 숫자형 데이터
    var $final_total = "";//총금액의 문자형 데이터
    var $each_price = 0; //각 선택 박스의 금액
    var $each_calc_price = []; //각 아이템별로 1개 단위마다 기본값(대기값) (배열 데이터)
    var $amount = []; //각 아이템별 수량
    var $each_total_price = []; //각 아이템별로 최종 값(배열 데이터)
    var $present_price = 0;

    $(".total_price_num span").text($total);

    

    var $each_box = `
    <li class="my_item">
        <div class="det_count">
            <div class="det_count_tit">
                <p class="opt_01">원두(분쇄없음)</p>
                <p class="opt_02">200g</p>
            </div>
            <div class="det_count_bx">
                <a class="minus" href="#">－</a>
                <input type="text" value="1" readonly>
                <a class="plus" href="#">＋</a>
            </div>
            <div class="det_count_price">
                <span class="each_price">14,000</span>원
            </div>
            <div class="item_del"><span>×</span></div>
        </div>
    </li>
    `;
    $(".det_total_price").hide();
    $("select#crush option:eq(0), select#gram option:eq(0)").prop("selected", true);

    function calc_price(){
        $total = 0;
        for(i=0;i<$each_total_price.length;i++){
            $total += $each_total_price[i]; //최종 배열 데이터 내부의 모든 값을 더한다.
        };
        $final_total = $total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        $(".total_price_num span").text($final_total); //총 금액 표기
        if($total == 0){
            $(".det_total_price").hide();
            $("select option").prop("selected", false);
            $("select#crush option:eq(0), select#gram option:eq(0)").prop("selected", true)
            $(".form_gram select").attr("disabled", true);
        }else{
            $(".det_total_price").show();
        }
    };
    
    $(".form_crush select").change(function(){
        $(".form_gram select").removeAttr("disabled");
    });

    $(".form_gram select").change(function(){
        $(".det_box ul").append($each_box);
        var $opt_01 = $("#crush option:selected").text();
        var $opt_02 = $("#gram option:selected").text();
        var $opt_02_val = parseFloat($(".form_gram select").val());

        $(".opt_box li:last .opt_01").text($opt_01);
        $(".opt_box li:last .opt_02").text($opt_02);

        $present_price = $num_price + $opt_02_val;
        $each_total_price.push($present_price); //옵션가 포함한 가격을 배열데이터로 저장

        $each_calc_price.push($present_price);

        $amount.push(1);
        console.log($amount);

        var $result_opt = $present_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        $(".opt_box li:last .each_price").text($result_opt);
        calc_price();
    });



    $(document).on("click",".det_count_bx a", function(){
        var $index = $(this).closest("li").index();
        var $class = $(this).attr("class");
        if($class == "plus"){
            $amount[$index]++;
        }else{
            if($amount[$index] !== 1){
                $amount[$index]--;
            };
        }
        console.log($amount[$index]);
        $(this).siblings("input").val($amount[$index]);
        $each_total_price[$index] = $each_calc_price[$index] * $amount[$index];

        var $result_price = $each_total_price[$index].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        $(this).closest(".det_count_bx").siblings(".det_count_price").find(".each_price").text($result_price);

        calc_price();

        return false;
    });

    $(document).on("click",".item_del span", function(){
        var $index = $(this).closest("li").index();
        $(this).closest("li").remove();
        $amount.splice($index,1);
        $each_total_price.splice($index,1);
        $each_calc_price.splice($index,1);
        calc_price();
    });

});