-- Install Timescale DB Extension (Added by: H.D.Ossias)
CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;

-- CreateTable
CREATE TABLE "assets" (
    "id" SERIAL NOT NULL,
    "tfit_id" INTEGER NOT NULL,
    "name" VARCHAR NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "max_allowable_temp" REAL,
    "min_allowable_temp" REAL,

    CONSTRAINT "fiber_group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "capacity" (
    "id" BIGSERIAL NOT NULL,
    "fiber_group_id" INTEGER NOT NULL,
    "time" TIMESTAMPTZ(6) NOT NULL,
    "capacity" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "capacity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fiber" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "fiber_group_id" INTEGER NOT NULL,
    "start" DOUBLE PRECISION NOT NULL,
    "end" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "fiber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "load" (
    "id" BIGSERIAL NOT NULL,
    "fiber_group_id" INTEGER NOT NULL,
    "time" TIMESTAMPTZ(6) NOT NULL,
    "load" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "load_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "location" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "coordinates" DECIMAL[],

    CONSTRAINT "location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" SERIAL NOT NULL,
    "asset_id" INTEGER NOT NULL,
    "fiber_id" INTEGER NOT NULL,
    "time" TIMESTAMPTZ(6) NOT NULL,
    "message" TEXT NOT NULL,
    "alert_level" VARCHAR NOT NULL,
    "action" VARCHAR NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sensor_data_glencore_sudbury" (
    "id" BIGSERIAL NOT NULL,
    "settings_id" INTEGER NOT NULL,
    "temp_celcius" REAL[],
    "strain" REAL[],
    "frequency_mhz" REAL[],
    "time" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sensor_data_glencore_sudbury_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sensor_diagnostics_glencore_sudbury" (
    "diagnostics_id" BIGSERIAL NOT NULL,
    "diagnostics" JSONB,
    "time" TIMESTAMPTZ(6)
);

-- CreateTable
CREATE TABLE "sensor_settings_glencore_sudbury" (
    "id" BIGSERIAL NOT NULL,
    "settings" JSONB,
    "time" TIMESTAMPTZ(6)
);

-- CreateTable
CREATE TABLE "temperature" (
    "id" SERIAL NOT NULL,
    "time" TIMESTAMPTZ(6) NOT NULL,
    "fiber_id" INTEGER NOT NULL,
    "max" DOUBLE PRECISION,
    "min" DOUBLE PRECISION,
    "avg" DOUBLE PRECISION
);

-- CreateTable
CREATE TABLE "tfit" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "location_id" INTEGER NOT NULL,

    CONSTRAINT "asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "three_d_model" (
    "id" SERIAL NOT NULL,
    "asset_id" INTEGER NOT NULL,
    "fiber_id" INTEGER NOT NULL,
    "configuration" JSON,

    CONSTRAINT "three_d_model_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "two_d_model" (
    "id" SERIAL NOT NULL,
    "asset_id" INTEGER NOT NULL,
    "svg_path" VARCHAR NOT NULL,
    "z_index" INTEGER NOT NULL DEFAULT 0,
    "fiber_id" INTEGER NOT NULL,

    CONSTRAINT "two_d_model_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "temperature_time_idx" ON "temperature"("time" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "temperature_id_time_key" ON "temperature"("id", "time");

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "asset_id" FOREIGN KEY ("tfit_id") REFERENCES "tfit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "capacity" ADD CONSTRAINT "fiber_group_id" FOREIGN KEY ("fiber_group_id") REFERENCES "assets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "fiber" ADD CONSTRAINT "fiber_group_id" FOREIGN KEY ("fiber_group_id") REFERENCES "assets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "load" ADD CONSTRAINT "fiber_group_id" FOREIGN KEY ("fiber_group_id") REFERENCES "assets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "asset_id" FOREIGN KEY ("asset_id") REFERENCES "tfit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "temperature" ADD CONSTRAINT "fiber_id" FOREIGN KEY ("fiber_id") REFERENCES "fiber"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tfit" ADD CONSTRAINT "location_id" FOREIGN KEY ("location_id") REFERENCES "location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "three_d_model" ADD CONSTRAINT "asset_id" FOREIGN KEY ("asset_id") REFERENCES "tfit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "two_d_model" ADD CONSTRAINT "asset_id" FOREIGN KEY ("asset_id") REFERENCES "tfit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "two_d_model" ADD CONSTRAINT "fiber_id" FOREIGN KEY ("fiber_id") REFERENCES "fiber"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- Create & Index A Hypertable for Temperature (Added by: H.D.Ossias)
SELECT create_hypertable('temperature', 'time');

CREATE INDEX ix_fiber_id_time ON temperature (fiber_id, time DESC);
