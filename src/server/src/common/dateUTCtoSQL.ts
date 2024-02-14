export const convertUTCtoSQL = (dateString: string):string => {
  const jsDate = new Date(dateString);

  const formatted = jsDate.toLocaleDateString('fr-CA') + ' ' + jsDate.toLocaleTimeString('fr-Fr');
  return formatted;
};
