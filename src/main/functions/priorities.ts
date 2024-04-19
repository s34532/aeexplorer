//@ts-nocheck
const fs = require('fs');

export function addPriorityDefault(name: string, prioritiesPath: string) {
  let properties;
  let jsonObj: { [key: string]: { priority: number } } = {};
  let keys = [];
  try {
    properties = fs.readFileSync(prioritiesPath, 'utf-8');
  } catch (error) {
    console.log('error reading properties json');
    return;
  }

  try {
    properties = JSON.parse(properties);
  } catch {
    properties = {};
  }

  if (!properties.hasOwnProperty(name)) {
    properties[name] = { priority: 0 };
  } else {
    console.log(name + ' exists and has value!');
    return;
  }

  try {
    fs.writeFileSync(prioritiesPath, JSON.stringify(properties));
    console.log(
      'Succesfully wrote property ' + name + ' to the properties json!',
    );
  } catch (error) {
    console.error('Error with writing properties file', error);
  }
}

export function changePriority(args, prioritiesPath: string) {
  let name = args[0];
  let priority = args[1];
  console.log('project name: ' + name);
  let properties;
  try {
    properties = fs.readFileSync(prioritiesPath, 'utf-8');
  } catch (error) {
    console.log('error reading properties json');
    return;
  }
  try {
    properties = JSON.parse(properties);
  } catch (error) {
    console.error(error);
  }

  try {
    properties[name] = { priority: priority };
  } catch (error) {
    console.error('error with writing ' + name + ' property.', error);
  }

  try {
    fs.writeFileSync(prioritiesPath, JSON.stringify(properties));
    console.log(
      'Succesfully wrote property ' + name + ' to the properties json!',
    );
  } catch (error) {
    console.error('Error with writing properties file', error);
  }
}

export function getPriorities(prioritiesPath: string) {
  let json;
  try {
    json = fs.readFileSync(prioritiesPath, 'utf-8');
    json = JSON.parse(json);
    return json;
  } catch (error) {
    console.error(error);
  }
}
