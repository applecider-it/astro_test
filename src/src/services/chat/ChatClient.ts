/**
 * チャットクライアント（ブラウザ側）
 * WebSocketでサーバー（Durable Object）と通信する
 */
export default class ChatClient {
  /** WebSocketインスタンス */
  private ws;

  /** 外部（UIなど）にメッセージを渡すためのコールバック */
  private setMessage;

  constructor(
    room: string,
    argSetMessage: (data: { message: string }) => void,
  ) {
    // WebSocket接続開始
    const url = `${window.App.config.apiHost}/chat/ws/${room}`;

    this.ws = new WebSocket(url);
    console.log('init WebSocket', { room, url });

    // 接続成功時
    this.ws.onopen = () => console.log('connected');

    // メッセージ受信時のハンドラ登録
    this.ws.onmessage = this.onMessage;

    // UI更新用の関数を保持
    this.setMessage = argSetMessage;
  }

  /** サーバーからメッセージを受信したときの処理 */
  private onMessage = (e: MessageEvent<any>) => {
    // JSON文字列をパース
    const data = JSON.parse(e.data);

    console.log('onMessage', data);

    // UI側にメッセージを渡す
    this.setMessage(data);
  };

  /** サーバーにメッセージ送信 */
  sendMessage(message: string) {
    if (!message) return;

    // JSON形式で送信（サーバー側でそのままbroadcastされる想定）
    this.ws.send(JSON.stringify({ message }));
  }
}
