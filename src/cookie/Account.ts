import { AccountStates } from "./AccountStates";
import Frames from "./frames";
import Game from "./game";
import Network from "./network";
import HaapiConnection from "./network/HaapiConnection";
import DTConstants from "./protocol/DTConstants";
import Dispatcher from "./utils/Dispatcher";

export default class Account {

  public username: string;
  public password: string;
  public game: Game;
  public network: Network;
  public haapi: HaapiConnection;
  public dispatcher: Dispatcher;
  public salt: string;
  public key: number[];
  public ticket: string;
  public server: object;
  public accountCreation: number;
  public accountId: number;
  public communityId: number;
  public hasRights: boolean;
  public login: number;
  public nickname: string;
  public secretQuestion: string;
  public subscriptionEndDate: number;
  public wasAlreadyConnected: boolean;
  public lang: string;
  public state: AccountStates;

  private frames: Frames;

  constructor(username: string, password: string, lang: string = "fr") {
    DTConstants.Init();
    this.username = username;
    this.password = password;
    this.lang = lang;
    this.state = AccountStates.NONE;
    this.dispatcher = new Dispatcher();
    this.haapi = new HaapiConnection();
    this.network = new Network(this);
    this.game = new Game(this);
    this.frames = new Frames(this);
  }

  public start() {
    this.haapi.processHaapi(this.username, this.password)
      .then(() => {
        console.log("Haapi : ", this.haapi);
        this.network.connect(DTConstants.config.sessionId, DTConstants.config.dataUrl);
      });
  }

  public stop() {
    this.network.close();
  }

  get isBusy(): boolean {
    return this.state !== AccountStates.NONE && this.state !== AccountStates.REGENERATING;
  }
}