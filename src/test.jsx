import React, { use, useEffect } from "react";


function TestComponent() {
    const passenger = 1;
    const name = "Mesfin";
    const phone = "0911000001"
    const selected_spot = 4
    useEffect(() => {
        try {
            const fetchData = async () => {
                const response = await fetch('https://busbooking-jvft.onrender.com/api/bookings', {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer an86Tmrg4d8G5RZqBJcyvSAiY6WvUywz1dV3Yxp511775974',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        // Your request payload here
                    }),
                });
                const data = await response.json();
                console.log(data);
            };
            fetchData();
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }, []);
    const SendValue = ({ passenger, name, phone, selected_spot }) => async (e) => {
        e.preventDefault();
        try { data = await fetch('https://busbooking-jvft.onrender.com/api/bookings', {
            method: 'POST',
            headers: {  
                'Authorization': 'Bearer an86Tmrg4d8G5RZqBJcyvSAiY6WvUywz1dV3Yxp511775974',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                passenger,
                name,
                phone,
                selected_spot
            }),
        });
        const result = await data.json();
        console.log(result);
    } catch (error) {
        console.error("Error sending data:", error);
    }
};

  return <div>Hello, World!
    <button onClick={SendValue({ passenger, name, phone, selected_spot })}> add </button>
  </div>;
}

export default TestComponent;
