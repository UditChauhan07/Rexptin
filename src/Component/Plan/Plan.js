import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Plan.module.css';
import Loader from '../Loader/Loader';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const Plan = ({ agentID, locationPath, subscriptionID }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [selectedAccordion, setSelectedAccordion] = useState(null);

  const navigate = useNavigate();
console.log(plans)
  // Fetch plans dynamically from the API (same for all countries)
  useEffect(() => {
    const fetchPlans = async () => {
      const apiUrl = `${API_BASE}/products`; // Fetch data from the same endpoint for all users
      console.log("apiUrl", apiUrl);

      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        console.log("Fetched data: ", data); // Check what the data looks like

        // Handle API response (products)
        const products = data.map(product => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: (product.prices[0].unit_amount / 100).toFixed(2), // Price in the selected currency
          currency: product.prices[0].currency.toUpperCase(),
          minutes: product.metadata?.minutes,
          period: product.prices[0].recurring?.interval ,
          priceId : product.prices[0].id
        }));
        console.log({products})

        setPlans(products);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError('Failed to load plans.');
        setLoading(false);
      }
    };

    fetchPlans();
  }, []); // Fetch plans once on component mount

  // Accordion toggle function
  const toggleAccordion = (id) => {
    setSelectedAccordion(selectedAccordion === id ? null : id);
  };

  if (loading) return <p className={styles.status}><Loader /></p>;
  if (error) return <p className={styles.statusError}>{error}</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.icon}>
          <img src="images/inlogo.png" alt="inlogo" />
        </div>
        <div className={styles.headercontent}>
          <h3>Select Your Plan</h3>
          <p>Customizable payment structures</p>
        </div>
      </div>

      {/* Display Plans */}
      <div className={styles.PlanDiv}>
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`${styles.planBox} ${selected === plan.id ? styles.selected : ''}`}
          >
            <div className={styles.part1}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="plan"
                  value={plan.id}
                  checked={selected === plan.id}
                  onChange={() => setSelected(plan.id)}
                />
                <div className={styles.planContent}>
                  <div className={styles.planTitle}>
                    <div>
                      <p>{plan.name}</p>
                      <span className={styles.description}>{plan.description.trim()}</span>
                    </div>
                  </div>
                  <div className={styles.planData}>
                    <p>
                      Price: <strong>{plan.price} {plan.currency}</strong> / {plan.period}
                    </p>
                    <p>
                      <strong>{plan.minutes}</strong> minutes included
                    </p>
                  </div>
                </div>
              </label>
            </div>

            {/* Accordion for extra details */}
            <div className={`${styles.accordion} ${selectedAccordion === plan.id ? styles.open : ''}`}>
              {plan.minutes && (
                <p>Includes <strong>{plan.minutes}</strong> minutes</p>
              )}
              <div className={styles.pricesContainer}>
                <div
                  className={styles.priceOption}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/checkout', { state: { priceId: plan.id } });
                  }}
                >
                  {plan.price} {plan.currency} / {plan.period}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Continue button */}
      <div className={styles.bottomBtn}>
        <div
          className={styles.btnTheme}
          onClick={() => {
            if (selected) {
              navigate('/checkout', { state: { priceId: plans[0].priceId, agentId: agentID, subscriptionId: subscriptionID, locationPath1: agentID ? locationPath : "/dsbd" } });
            } else {
              alert('Please select a plan first');
            }
          }}
        >
          <img src="svg/svg-theme.svg" alt="" />
          <p>Continue</p>
        </div>
      </div>
    </div>
  );
};

export default Plan;
