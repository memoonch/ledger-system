CREATE TABLE import_requests (id INTEGER PRIMARY KEY, payload TEXT NOT NULL CHECK(json_valid(payload)));
CREATE TRIGGER import_customer AFTER INSERT ON import_requests BEGIN
  INSERT INTO parties (id,name,phone,address,opening_date,opening_paisa)
    SELECT json_extract(NEW.payload,'$.party.id'),json_extract(NEW.payload,'$.party.name'),json_extract(NEW.payload,'$.party.phone'),json_extract(NEW.payload,'$.party.address'),json_extract(NEW.payload,'$.party.opening_date'),json_extract(NEW.payload,'$.party.opening_paisa');
  INSERT INTO ledger_transactions (id,party_id,date,description,brand,vehicle_number,bill_number,quantity_milli,rate_paisa,debit_paisa,credit_paisa,created_at)
    SELECT json_extract(value,'$.id'),json_extract(value,'$.party_id'),json_extract(value,'$.date'),json_extract(value,'$.description'),json_extract(value,'$.brand'),json_extract(value,'$.vehicle_number'),json_extract(value,'$.bill_number'),json_extract(value,'$.quantity_milli'),json_extract(value,'$.rate_paisa'),json_extract(value,'$.debit_paisa'),json_extract(value,'$.credit_paisa'),json_extract(value,'$.created_at')
    FROM json_each(NEW.payload,'$.transactions');
  DELETE FROM import_requests WHERE id=NEW.id;
END;
