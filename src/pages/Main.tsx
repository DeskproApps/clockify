import { useInitialisedDeskproAppClient } from "@deskpro/app-sdk";
import { useNavigate } from "react-router-dom";

export const Main = () => {
  const navigate = useNavigate();
  useInitialisedDeskproAppClient((client) => {
    client.registerElement("refresh", {
      type: "refresh_button",
    });

    client.setHeight(500);

    client.getUserState("workspace").then((userState) => {
      if (!userState[0]?.data || userState[0]?.data === "") {
        navigate("/login");
      } else {
        navigate("/timer");
      }
    });
  }, []);
  return <div></div>;
};
