(function($){

    // テキスト（複数行）をオーバーレイエディタに変更する
    function convertOverlay(fieldId) {
        const name = `content-field-${fieldId}`;
        const value = $(`[name="${name}"]`).attr('name', '').val();
        const $container = $(`#contentField${fieldId}`).hide();
        const label = $container.find('label').first().html().trim();
        $container.after(
            `<div class="form-group"><label>${label}</label><textarea name="${name}"></textarea></div>`
        ).hide();
        $(`[name="${name}"]`).val(value).mtapp('overlayEditor');
    }
    convertOverlay(242);

})(jQuery);
