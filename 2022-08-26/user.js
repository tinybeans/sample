(function ($) {
    // 特定のコンテンツタイプだけにカスタマイズを適用する。下記の if 文の中の「55」部分を、
    // 関連付けをする「関連記事」フィールドがあるサイトの ID になります。
    if (mtappVars.type.indexOf('content_data') !== -1 && mtappVars.content_type_id === 55) {
        // コンテンツフィールドのIDを指定します。
        // ブラウザの開発者ツールで入力欄（今回は「オススメ書籍一覧」」フィールドのテキストエリア）を確認し、
        // <input type="text" name="content-field-269" となっている 269 部分が該当します。
        const contentFieldId = '269';

        // 関連付けるコンテンツタイプのエンドポイントを指定します。36, 54 部分は適宜変更してください。
        // - 36 は関連付けるコンテンツタイプが保存されているサイトの ID
        // - 54 は関連付けるコンテンツタイプの ID
        const endPoint = '<mt:CGIPath /><mt:DataAPIScript />/v4/sites/36/contentTypes/54/data';

        // エンドポイントに渡すパラメータを設定
        const params = {
            limit: 1000000
        };

        // 選択されたコンテンツデータのデータ識別ラベルを表示する枠を実装
        const tempId = mtapp.temporaryId();
        $('#contentField' + contentFieldId).append('<div id="' + tempId + '"></div>');
        const listingLabels = new Vue({
            el: '#' + tempId,
            data: {
                items: []
            },
            template: '<ul class="mt-5 w-100"><li v-for="item in items">{{ item.label }}</li></ul>'
        });

        // 関連記事フィールドにイベントをセットしていく
        $('[name="content-field-' + contentFieldId + '"]')
            // 選択されたコンテンツデータのデータ識別ラベルを表示する仕組みを実装
            .on('MTAppShowSelectedItems', function () {
                const value = $(this).val();
                if (!value) {
                    return;
                }
                mtapp.loadingImage('show');
                const ids = value.replace(/^,+|,+$/g, '').split(',');
                $.ajax({
                    url: endPoint,
                    dataType: 'json',
                    data: params,
                    cache: false
                }).done(function (res) {
                    listingLabels.items = [];
                    const items = res.items;
                    for (let i = 0; i < items.length; i++) {
                        const id = '' + items[i].id;
                        if (ids.indexOf(id) !== -1) {
                            listingLabels.items.push(items[i]);
                        }
                    }
                    mtapp.loadingImage('hide');
                });
            })
            // MTAppListing を適用
            .MTAppListing({
                url: endPoint,
                data: params,
                dialogTitle: '関連記事を選択',
                cbAfterOK: function (cb, $container, $field) {
                    $field.trigger('MTAppShowSelectedItems');
                },
                jsontable: {
                    header: { id: 'ID', label: 'タイトル' },
                    headerOrder: ['id', 'label'],
                    itemsRootKey: 'items',
                    listingTargetKey: 'id',
                    listingCheckboxType: 'checkbox',
                    listingTargetEscape: false
                }
            })
            // フィールドを手動で入力できないようにしておく
            .prop('readonly', true)
            // ページがロードされたときに既に関連付けられている記事を表示する
            .trigger('MTAppShowSelectedItems')
            // 最大文字数などの不要なフィールドを非表示にする
            .nextAll('small')
            .hide();
    }
})(jQuery);
