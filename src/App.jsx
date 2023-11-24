import React, { useEffect, useState } from "react";
import mqtt from "mqtt";
import { TextInput } from "@mantine/core";

const App = () => {
  const [msg, setMsg] = useState();
  const [publishValue, setPublicValue] = useState();
  const [subscribeValue, setSubscribeValue] = useState();
  const [topicValue, setTopicValue] = useState();
  const [topicV, setTopicV] = useState();
  const [msgArr, setMsgArr] = useState([]);
  const [chg, setChg] = useState(true);
  const [handleMsg, setHandleMsg] = useState();
  const [broker, setBroker] = useState();

  const client = mqtt.connect(
    "wss://htookhant:Admin123@f6ce8c16ab1f4b958a2179d249d62bf3.s2.eu.hivemq.cloud:8884/mqtt"
  );

  useEffect(() => {
    client.on("connect", () => {
      if (topicValue == "device") {
        console.log("topic is d");

        client.subscribe("device", (err) => {
          err && console.log(err);
        });
      } else if (topicValue == "testtopic") {
        console.log("topic is t");
        client.subscribe("testtopic", (err) => {
          err && console.log(err);
        });
      }
    });
  }, [topicValue]);

  useEffect(() => {
    const handleMessage = (topic, message) => {
      console.log("====================================");
      console.log(topic);
      console.log("====================================");
      const text = message.toString();
      setMsgArr((prevMsgArr) => [...prevMsgArr, text]);
    };

    client.on("message", handleMessage);

    return () => {
      client.end(); // Cleanup: Ensure client is closed when the component unmounts
      client.removeListener("message", handleMessage); // Remove the listener on unmount
    };
  }, [topicValue]);

  useEffect(() => {
    setMsgArr([]);
  }, [broker]);

  const publishHandler = (topic, value) => {
    client.publish(topic, value);
  };
  console.log("====================================");
  console.log(msgArr);
  console.log("====================================");

  return (
    <div className="flex bg-[#fafafa] flex-wrap justify-center gap-16 h-screen items-center">
      <div className=" shadow-2xl bg-white shadow-green-500/30 p-5 rounded-md flex-col">
        <div className="font-semibold text-xl mb-2 ms-1  text-gray-500">
          Publisher
        </div>
        <div className="flex gap-4 mb-5">
          <TextInput
            value={topicV}
            onChange={(e) => setTopicV(e.target.value)}
            variant="filled"
            size="md"
            radius="md"
            placeholder="Enter Topic"
          />
          <TextInput
            value={publishValue}
            onChange={(e) => setPublicValue(e.target.value)}
            variant="filled"
            size="md"
            radius="md"
            placeholder="Enter Publish"
          />
          <button
            onClick={() => publishHandler(topicV, publishValue)}
            className="bg-green-500 text-white rounded-md  px-3 py-2 "
          >
            Publish
          </button>
        </div>
        <div className="font-semibold text-xl mb-2 ms-1  text-gray-500">
          Suscriber
        </div>
        <div className="flex gap-4">
          <TextInput
            value={topicValue}
            onChange={(e) => setTopicValue(e.target.value)}
            variant="filled"
            size="md"
            radius="md"
            placeholder="Enter Topic"
          />
        </div>
      </div>
      <div className=" shadow-2xl bg-white h-[80vh] w-[600px]  shadow-green-500/30 p-6 pt-7 flex items-start gap-3 rounded-md flex-col">
        <div className=" ms-2 text-xl font-semibold font-mono text-gray-500">
          Subscription
        </div>
        <div className=" flex gap-2">
          <button
            onClick={() => {
              setBroker("testtopic"), setTopicValue("testtopic");
            }}
            className={
              broker == "testtopic"
                ? "bg-green-500 text-white rounded-full  px-3 py-2 "
                : "bg-transparent border-green-500 text-green-500 border rounded-full  px-3 py-2 "
            }
          >
            testtopic
          </button>
          <button
            onClick={() => {
              setBroker("device"), setTopicValue("device");
            }}
            // className="bg-transparent border-green-500 text-green-500 border rounded-full  px-3 py-2 "
            className={
              broker == "device"
                ? "bg-green-500 text-white rounded-full  px-3 py-2 "
                : "bg-transparent border-green-500 text-green-500 border rounded-full  px-3 py-2 "
            }
            // className="bg-transparent border-green-500 text-green-500 border rounded-full  px-3 py-2 "
          >
            device
          </button>
        </div>
        <div className="overflow-scroll flex flex-col items-start gap-2 w-full h-full pt-5">
          {msgArr.map((e) => (
            <div className="bg-slate-200 inline px-5 rounded-full py-3">
              {e}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
