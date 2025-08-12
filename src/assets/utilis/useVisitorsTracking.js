import axios from "axios";
import { useEffect } from "react";
 

 export const useVisitorsTracking = (api) => {
  
  const todayDate = new Date().toLocaleDateString("en-GB");

  //  Daily Unique Visitors Tracker
  useEffect(() => {
    const sendVisitorId = async (visitorId) => {
      try {
        const res = await axios.post(`${api}/api/analytics/api/visit`, {
          visitorId,
        });
        if (res) {
          localStorage.setItem("todayDate", JSON.stringify(todayDate));
        }
      } catch (error) {
        console.error("Error sending visitor ID:", error);
      }
    };

    const visitorId = localStorage.getItem("visitorId");
    const storedDate = localStorage.getItem("todayDate");

    if (!visitorId && !storedDate) {
      const randomVisitorId = crypto.randomUUID();
      localStorage.setItem("todayDate", JSON.stringify(todayDate));
      localStorage.setItem("visitorId", JSON.stringify(randomVisitorId));
      sendVisitorId(randomVisitorId);
    } else {
      const parsedDate = JSON.parse(storedDate);
      if (parsedDate !== todayDate) {
        const parsedId = JSON.parse(visitorId);
        sendVisitorId(parsedId);
      }
    }
  }, []);

  
};

 
