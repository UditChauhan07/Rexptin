import React, { useState, useEffect } from "react";
import styles from "../Start/Start.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import AnimatedButton from "../AnimatedButton/AnimatedButton";
import axios from "axios";
import { token } from "../../Store/apiStore";
import useTrafficSource from "../../lib/sourceGet";

function Start() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const referral = searchParams.get("referral") || "";
  const selectedPlan = searchParams.get("plan") || "";
  const businessType = searchParams.get("businessType") || "";
  const [step, setStep] = useState(0);
  const handleClick = () => {
    setTimeout(() => setStep(1), 150);
    setTimeout(() => setStep(2), 250);
    setTimeout(() => setStep(3), 350);
    setTimeout(() => setStep(4), 450);
    setTimeout(() => setStep(5), 650);
    setTimeout(() => {
      navigate("/signup");
    }, 700);
  };
  console.log(referral, selectedPlan)
  useEffect(() => {
    const handleReferral = async () => {
      const currentDomain = window.location.hostname;
      const isFromReferrerLink = currentDomain === "refer.rxpt.us";

      if (referral && isFromReferrerLink) {
        try {
          const res = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/endusers/check-code/${referral}` ,
            {
               headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },            }
          );

          if (res?.data?.valid) {
            sessionStorage.setItem("referredBy", referral);
            window.location.href = `https://app.rexpt.in?referral=${referral}`;
            navigate("/signup", { replace: true });
          }
          else {
            window.location.href = `https://app.rexpt.in/`;
            sessionStorage.removeItem("referredBy");
          }
        } catch (error) {
          console.error("Failed to validate referral:", error);
        }
      }

      let updated = false;
      if (referral && !isFromReferrerLink) {
        try {
          const res = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/endusers/check-code/${referral}` , 
            {
               headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
            }
          );
          if (res?.data?.valid) {
          sessionStorage.setItem("referredBy", referral);
          searchParams.delete("referral");
          navigate("/signup", { replace: true });
          updated = true;
           }else {
            console.log("Invalid referral code:", referral);
            sessionStorage.removeItem("referredBy");
           }

        } catch (error) {
          console.error("Failed to validate referral:", error);
          sessionStorage.removeItem("referredBy");
        }
        }
        if (selectedPlan) {
          sessionStorage.setItem("selectedPlan", selectedPlan);
          searchParams.delete("plan");
          updated = true;
        }
        if (businessType) {
          sessionStorage.setItem("businessType", businessType);
          searchParams.delete("businessType");
          updated = true;
        }

        if (updated) {
          navigate(location.pathname, { replace: true });
        }
      };

      handleReferral();
    }, [referral, selectedPlan, businessType, location.pathname, location.search, navigate]);

  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    setVH();
    window.addEventListener("resize", setVH);

    return () => window.removeEventListener("resize", setVH);
  }, []);
  return (
    <div>
      <div className={styles.signUpContainer}>
        <div className={styles.StartMain}>
          <div>
            {/* floating ellipses */}
            <img src="images/Ellipse 1.png" alt="Ellipse 1" />
            <img src="images/Ellipse 2.png" alt="Ellipse 2" />
            <img src="images/Ellipse 5.png" alt="Ellipse 5" />
            <img src="images/Ellipse 3.png" alt="Ellipse 3" />
            <img src="images/Ellipse 4.png" alt="Ellipse 4" />
            <img src="images/Ellipse 6.png" alt="Ellipse 6" />
            <img src="images/Ellipse 7.png" alt="Ellipse 7" />
            <img src="images/Ellipse 8.png" alt="Ellipse 8" />
            <img src="images/Ellipse 9.png" alt="Ellipse 9" />
            <img src="images/Ellipse 10.png" alt="Ellipse 10" />
            <img src="images/Ellipse 11.png" alt="Ellipse 11" />
          </div>
        </div>

        <div className={styles.content}>
          <div
            className={`${styles.LogoDiv} ${step >= 1 ? styles.slideRight : ""
              }`}
          >
            <img src="svg/Rexpt-Logo.svg" alt="Rexpt-Logo" />
          </div>

          <div className={styles.part}>
            <div
              className={`${styles.part2} ${step >= 2 ? styles.slideRight : ""
                }`}
            >
              <p className={styles.heading}>
                Launch Your <b>AI Receptionist</b>
              </p>
            </div>

            <div
              className={`${styles.withlogo} ${step >= 3 ? styles.slideRight : ""
                }`}
            >
              <p className={styles.with}>with </p>
              <p>
                <img src="svg/Rexpt-Logo.svg" alt="Rexpt-Logo" />
              </p>
            </div>
            <p
              className={`${styles.desc} ${step >= 4 ? styles.slideRight : ""}`}
            >
              Engage leads by voice, automate bookings & reminders, and unlock
              actionable call analytics—powered by Rexpt.in.
            </p>
          </div>
          <br />
          <div
            className={`${styles.parentDiv} ${step >= 5 ? styles.slideRight : ""
              }`}
          >
            <div className={styles.stickyWrapper} onClick={handleClick}>
              <AnimatedButton label="Let's Start" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Start;
