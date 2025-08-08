-- Publisher/tFIT
-- create replicator role
CREATE ROLE replicator WITH REPLICATION LOGIN PASSWORD 'replicator';
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO replicator;

-- create publication
CREATE PUBLICATION c4_demo_lab;
ALTER PUBLICATION c4_demo_lab
ADD TABLE sensor_data_demo_lab, sensor_settings_demo_lab, sensor_diagnostics_demo_lab


-- Subscription/AWS server
-- create the tables
-- then create subscription
CREATE SUBSCRIPTION c4_demo_lab_subscription
CONNECTION 'host=localhost port=3399
password=replicator user=replicator dbname=hyperion' PUBLICATION c4_demo_lab;



