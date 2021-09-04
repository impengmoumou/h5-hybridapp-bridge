import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Button, Modal, Toast } from "antd-mobile";
import H5HybridAppBridge from "../src/index.js";

const bridge = new H5HybridAppBridge({
  webDev: true,
  showConsole: true,
  NODE_ENV: "development",
});

const Test = () => {
  const [showModal, setShowModal] = useState(false);
  const [buttonList, setButtonList] = useState([]);
  const [jumpUrl, setJumpUrl] = useState("");
  const [eventType, setEventType] = useState("");
  const [eventParams, setEventParams] = useState({});

  useEffect(() => {
    const defaultList = [
      {
        onClick: () => {
          Toast.loading("Loading...", 0);
          bridge.getAppInfo(
            "getAppReferralInfo",
            {},
            (data) => {
              console.log(data);
              if (!data.privacyStatus) {
                console.log("TermsCom");
              } else {
                console.log("ActivityCom");
              }
              Toast.hide();
            },
            () => {
              Toast.hide();
              setShowModal(true);
            }
          );
        },
        text: "getAppReferralInfo",
      },
      {
        onClick: () =>
          bridge.callHandlerToApp("callNativeApp", {
            type: "uploadTrace",
            event: "H5-Click",
            value_string: "",
            module: "H5 ",
          }),
        text: "uploadTrace",
      },
      {
        onClick: () =>
          bridge.callHandlerToApp("callNativeApp", {
            type: "referralPrivacy",
            agree: true,
            value_string: "",
            event: "WEB_H5_REFERRAL_TERMS_AGREE",
            module: "REFERRAL",
          }),
        text: "referralPrivacy",
      },

      {
        onClick: () =>
          bridge.callHandlerToApp("callNativeApp", {
            type: "shareLink",
            link: "",
            value_string: "{utm_champaign:''}",
            event: "WEB_H5_REFERRAL_INDEX_SHARE",
            module: "REFERRAL",
          }),
        text: "shareLink",
      },
      {
        onClick: () => bridge.goBack(),
        text: "back",
      },
      {
        onClick: () => bridge.goBack(0),
        text: "backToApp",
      },
      {
        onClick: () => bridge.goBack(1),
        text: "backHome",
      },
      {
        onClick: () => bridge.reload(),
        text: "reloadURL",
      },
      {
        onClick: () => bridge.goApp("app://goToHelp"),
        text: "goToHelp",
      },
    ];
    setButtonList(defaultList);
  }, []);

  return (
    <div>
      {buttonList.map((button, index) => (
        <Button onClick={button.onClick} key={index}>
          {button.text}
        </Button>
      ))}
      <input
        onChange={(e) => {
          setEventType(e.target.value);
        }}
      ></input>
      <input
        onChange={(e) => {
          setEventParams(e.target.value);
        }}
      ></input>
      <Button
        onClick={() => {
          if (!eventType) {
            return;
          }
          try {
            bridge.callHandlerToApp(eventType, eventParams);
          } catch (err) {
            console.log(err);
          }
        }}
      >
        执行
      </Button>
      <input
        onChange={(e) => {
          setJumpUrl(e.target.value);
        }}
      ></input>
      <Button
        onClick={() => {
          if (!jumpUrl) {
            return;
          }
          bridge.goApp(jumpUrl);
        }}
      >
        跳转
      </Button>
      <Modal
        visible={showModal}
        transparent
        maskClosable={bridge.isWeb}
        onClose={() => setShowModal(false)}
        footer={[
          {
            text: "Back",
            onPress: () => {
              bridge.goBack(0);
            },
          },
          {
            text: "Retry",
            onPress: () => {
              bridge.reload();
            },
          },
        ]}
      >
        <div className="load-failed-text">
          The current network is unstable and the page has failed to load.
          Please try again...
        </div>
      </Modal>
    </div>
  );
};

ReactDOM.render(<Test></Test>, document.getElementById("root"));
