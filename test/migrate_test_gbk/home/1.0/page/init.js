/**
 * @fileOverview 
 * @author  
 */
KISSY.add(function (S) {

    /**
     * ����ķ�ʽ���Զ�ִ������require������ģ���init����
     *      1���첽ִ�У���ģ�鲻�ụ��Ӱ��
     *      2����ģ�鶼��¶init������ģ�����ɾֻ��Ҫ�޸�requires�Ϳ�����
     * ����һ��ģ���ִ�з�ʽ������ȫ����ɾ����δ��룬�����Լ���ϰ�߱�д.
     */
    var args = S.makeArray(arguments);
    S.ready(function() {
        for (var i = 1; i < args.length; i++) {
            var module = args[i] || {};
            module.init && setTimeout((function( m ){
                return function(){ m.init() };
            })(module),0);
        }
    });
    
}, { requires: [
    /* ����ֱ������utils�е�ģ��
    'utils/js/mod'
    */
]});
