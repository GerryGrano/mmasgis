package it.metmi.mmasgis.util;



import it.metmi.mmasgis.util.Const;

import java.util.Calendar;
import java.util.GregorianCalendar;

import com.itextpdf.text.Document;
import com.itextpdf.text.Element;
import com.itextpdf.text.ExceptionConverter;
import com.itextpdf.text.Font;
import com.itextpdf.text.Image;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Rectangle;
import com.itextpdf.text.pdf.BaseFont;
import com.itextpdf.text.pdf.PdfContentByte;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfPageEventHelper;
import com.itextpdf.text.pdf.PdfTemplate;
import com.itextpdf.text.pdf.PdfWriter;


public class MyPageEventListener extends PdfPageEventHelper {
	//LOGO E NOME
	public static String censimento;

	public MyPageEventListener(String c) {
		censimento = c;
	}
	protected PdfTemplate total;
	protected BaseFont time;
	public void onOpenDocument(PdfWriter writer, Document document) {
		total = writer.getDirectContent().createTemplate(100, 100);
		total.setBoundingBox(new Rectangle(-20, -20, 100, 100));
		try {
			time = BaseFont.createFont(BaseFont.TIMES_ROMAN,BaseFont.WINANSI, BaseFont.NOT_EMBEDDED);
		} catch (Exception e) {
			throw new ExceptionConverter(e);
		}
	}
	public void onStartPage (PdfWriter writer, Document document) {
		try {
			PdfPTable header = new PdfPTable(1);
			//Image png = Image.getInstance("C:/Program Files/Apache Software Foundation/Tomcat 7.0/webapps/mmasgis/img/mt.png");
			Image png = Image.getInstance(Const.imgPath);
			png.setAbsolutePosition(50, 750);
			document.add(png);
			Font hel_bold_big  = new Font(Font.FontFamily.HELVETICA, 14,  Font.BOLD);
			Font hel_bold_small  = new Font(Font.FontFamily.HELVETICA, 12,  Font.BOLD);
			PdfPCell cell=new PdfPCell();
			cell.setBorder(0);
			Paragraph p=new Paragraph("SCHEDA ANAGRAFICA", hel_bold_big);
			p.setAlignment(Element.ALIGN_CENTER);
			cell.addElement(p);
        	header.addCell(cell);
        	p=new Paragraph(""+censimento  +"\n\r\n\r\n\r\n\r", hel_bold_small);
            p.setAlignment(Element.ALIGN_CENTER);
            cell=new PdfPCell();
            cell.setBorder(0);
            cell.addElement(p);
            header.addCell(cell);
            document.add(header);
           }
		catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	//FOOTER
	public void onEndPage(PdfWriter writer, Document document) {
		PdfContentByte cb = writer.getDirectContent();
		cb.saveState();
		String pag = "Pagina " + writer.getPageNumber();
		Calendar cal = new GregorianCalendar();
		String cr = "© Copyright Marketing & Telematica 2003-"+cal.get(Calendar.YEAR);

		//pagina
		float textBase = document.bottom() - 20;
		float textSize = time.getWidthPoint(pag, (float)8.5);
		cb.beginText();
		cb.setFontAndSize(time, 12);
		float adjust = time.getWidthPoint("0", 12);
		cb.setTextMatrix(document.right() - textSize - adjust, textBase);
		cb.showText(pag);
		cb.endText();
		cb.addTemplate(total, document.right() - adjust, textBase);
		//cb.restoreState();
		//copyright
		float adjustLeft = time.getWidthPoint("0", -475);
		float textBase3 = document.bottom() - 20;
		float textSize3 = time.getWidthPoint(cr, (float)12.3);
		cb.beginText();
		cb.setFontAndSize(time, 12);
		cb.setTextMatrix(document.left() - textSize3 - adjustLeft, textBase3);
		cb.showText(cr);
		cb.endText();
		cb.addTemplate(total, document.left() - adjustLeft, textBase3);
		cb.restoreState();
	}

}
