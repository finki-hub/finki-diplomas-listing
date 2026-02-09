type Diploma = {
  dateOfSubmission: string;
  description: string;
  fileUrl: null | string;
  member1: string;
  member2: string;
  mentor: string;
  status: string;
  student: string;
  title: string;
};

const stripTags = (html: string): string =>
  // eslint-disable-next-line regexp/no-super-linear-move
  html.replaceAll(/<[^>]*>/gu, '').trim();

export const isAuthenticated = (html: string): boolean =>
  html.includes('Датум на пријавување') || !html.includes('Датум на одбрана');

const getByLabel = (panel: string, label: string): string => {
  const rowRegex = /<tr[^>]*>(?<content>[\s\S]*?)<\/tr>/giu;
  let rowMatch;

  while ((rowMatch = rowRegex.exec(panel)) !== null) {
    const row = rowMatch.groups?.content ?? '';
    const cells = [...row.matchAll(/<td[^>]*>(?<cell>[\s\S]*?)<\/td>/giu)];
    const labelCell = cells[0]?.groups?.cell ?? '';
    const valueCell = cells[1]?.groups?.cell ?? '';

    if (cells.length >= 2 && stripTags(labelCell).includes(label)) {
      const strongMatch = /<strong>(?<text>[\s\S]*?)<\/strong>/iu.exec(
        valueCell,
      );

      return strongMatch?.groups?.text
        ? stripTags(strongMatch.groups.text)
        : '';
    }
  }

  return '';
};

const getFileUrl = (panel: string): null | string => {
  const rowRegex = /<tr[^>]*>(?<content>[\s\S]*?)<\/tr>/giu;
  let rowMatch;

  while ((rowMatch = rowRegex.exec(panel)) !== null) {
    const row = rowMatch.groups?.content ?? '';
    const cells = [...row.matchAll(/<td[^>]*>(?<cell>[\s\S]*?)<\/td>/giu)];
    const labelCell = cells[0]?.groups?.cell ?? '';
    const valueCell = cells[1]?.groups?.cell ?? '';

    if (cells.length >= 2 && stripTags(labelCell).includes('Датотека')) {
      const hrefMatch = /<a[^>]*href="(?<url>[^"]*)"[^>]*>/iu.exec(valueCell);

      if (
        hrefMatch?.groups?.url &&
        // eslint-disable-next-line no-script-url
        hrefMatch.groups.url !== 'javascript:void(0)'
      ) {
        return hrefMatch.groups.url;
      }

      return null;
    }
  }

  return null;
};

export const parseDiplomas = (html: string): Diploma[] => {
  const diplomas: Diploma[] = [];

  const panelMarker = 'class="panel ';
  const panelStarts: number[] = [];
  let searchFrom = 0;

  while (true) {
    const idx = html.indexOf(panelMarker, searchFrom);

    if (idx === -1) {
      break;
    }

    const divStart = html.lastIndexOf('<div', idx);

    if (divStart !== -1) {
      panelStarts.push(divStart);
    }

    searchFrom = idx + panelMarker.length;
  }

  for (let i = 0; i < panelStarts.length; i++) {
    const start = panelStarts[i];
    const end = i + 1 < panelStarts.length ? panelStarts[i + 1] : html.length;
    const panel = html.slice(start, end);

    const headingMatch =
      /class="[^"]*panel-heading[^"]*"[^>]*>(?<heading>[\s\S]*?)<\/div>/iu.exec(
        panel,
      );
    const title = headingMatch?.groups?.heading
      ? stripTags(headingMatch.groups.heading)
      : '';

    diplomas.push({
      dateOfSubmission: getByLabel(panel, 'Датум на пријавување'),
      description: getByLabel(panel, 'Краток опис'),
      fileUrl: getFileUrl(panel),
      member1: getByLabel(panel, 'Член 1'),
      member2: getByLabel(panel, 'Член 2'),
      mentor: getByLabel(panel, 'Ментор'),
      status: getByLabel(panel, 'Статус'),
      student: getByLabel(panel, 'Студент'),
      title,
    });
  }

  return diplomas;
};
