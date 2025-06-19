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
  const [billingInterval, setBillingInterval] = useState('monthly');
  
  const navigate = useNavigate();

  // Fetch plans dynamically from API
  useEffect(() => {
    const fetchPlans = async () => {
      const apiUrl = `${API_BASE}/products`; // API endpoint for non-India-specific products
      
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        console.log("Fetched data: ", data); // Check what the data looks like

        // Check if products data is available
        if (data && Array.isArray(data)) {
          const products = data.map(product => ({
            id: product.id,
            name: product.name,
            description: product.description,
            price: (product.prices[0].unit_amount / 100).toFixed(2), // Assuming the price is in cents
            currency: product.prices[0].currency.toUpperCase(),
            minutes: product.metadata?.minutes,
          }));
          setPlans(products);
        } else {
          throw new Error('Invalid response format');
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError('Failed to load plans.');
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const toggleAccordion = (id) => {
    setSelectedAccordion(selectedAccordion === id ? null : id);
  };

  // Display all plans (no billing interval filtering since it's not in the response)
  const getMonthlyPrice = (plan) => {
    return plan.price; // Assuming the price is already monthly
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
                  {getMonthlyPrice(plan)} {plan.currency} / monthly
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
              navigate('/checkout', { state: { priceId: selected, agentId: agentID, subscriptionId: subscriptionID, locationPath1: agentID ? locationPath : "/dsbd" } });
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
