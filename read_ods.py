import zipfile
import xml.etree.ElementTree as ET

try:
    with zipfile.ZipFile('tabla-inmobiliaria.ods', 'r') as z:
        with z.open('content.xml') as f:
            tree = ET.parse(f)
            root = tree.getroot()
            
            ns = {
                'table': 'urn:oasis:names:tc:opendocument:xmlns:table:1.0',
                'text': 'urn:oasis:names:tc:opendocument:xmlns:text:1.0'
            }
            
            for table in root.findall('.//table:table', ns):
                name_attr = '{urn:oasis:names:tc:opendocument:xmlns:table:1.0}name'
                print('Table: ' + str(table.get(name_attr)))
                rows = table.findall('table:table-row', ns)
                if not rows: continue

                # Print first 5 rows to identify headers and data types
                for i, row in enumerate(rows[:5]):
                    cells = []
                    for cell in row.findall('table:table-cell', ns):
                        repeat_attr = '{urn:oasis:names:tc:opendocument:xmlns:table:1.0}number-columns-repeated'
                        repeat = cell.get(repeat_attr)
                        
                        text_content = ""
                        # Sometimes text is in text:p, sometimes nested
                        ps = cell.findall('.//text:p', ns)
                        if ps:
                            text_content = " ".join([p.text for p in ps if p.text])
                        
                        cells.append(text_content)
                        if repeat:
                            try:
                                for _ in range(int(repeat) - 1):
                                    cells.append(text_content)
                            except ValueError:
                                pass # ignore invalid repeat
                    print('Row ' + str(i) + ': ' + str(cells))
except Exception as e:
    import traceback
    traceback.print_exc()
