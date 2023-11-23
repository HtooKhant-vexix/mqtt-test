import React, { useEffect, useState } from "react";
import mqtt from "mqtt";
import { TextInput } from "@mantine/core";

const App = () => {
  const [msg, setMsg] = useState();
  const [publishValue, setPublicValue] = useState();
  const [subscribeValue, setSubscribeValue] = useState();
  const [topicValue, setTopicValue] = useState("testtopic");
  const [topicV, setTopicV] = useState("testtopic");
  const [msgArr, setMsgArr] = useState([]);
  const [chg, setChg] = useState(true);
  const [handleMsg, setHandleMsg] = useState();

  const client = mqtt.connect(
    "wss://htookhant:Admin123@f6ce8c16ab1f4b958a2179d249d62bf3.s2.eu.hivemq.cloud:8884/mqtt"
  );

  useEffect(() => {
    const handleMessage = (topic, message) => {
      const text = message.toString();
      setHandleMsg(text);
      setMsgArr((prevMsgArr) => [...prevMsgArr, text]);
    };

    client.on("connect", () => {
      client.subscribe(topicValue, (err) => {
        err && console.log(err);
      });
    });

    client.on("message", handleMessage);

    return () => {
      client.end(); // Cleanup: Ensure client is closed when the component unmounts
      client.removeListener("message", handleMessage); // Remove the listener on unmount
    };
  }, []);

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
      <div className=" shadow-2xl bg-white h-[80vh] w-[600px] overflow-scroll shadow-green-500/30 p-6 pt-7 flex items-start gap-3 rounded-md flex-col">
        {msgArr.map((e) => (
          <div className="bg-slate-200 inline px-5 rounded-full py-3">{e}</div>
        ))}
      </div>
    </div>
  );
};

export default App;
