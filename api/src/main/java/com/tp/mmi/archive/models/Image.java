package com.tp.mmi.archive.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
public class Image {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long idImage;

    private String url;
    private String legende;
    private int ordre;

    @ManyToOne
    @JoinColumn(name = "id_sae")
    @JsonBackReference("sae-images")
    private Sae sae;

    public Image() {}

    public Image(String url, String legende, int ordre, Sae sae) {
        this.url = url;
        this.legende = legende;
        this.ordre = ordre;
        this.sae = sae;
    }

    public Long getIdImage() { return idImage; }
    public void setIdImage(Long idImage) { this.idImage = idImage; }
    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
    public String getLegende() { return legende; }
    public void setLegende(String legende) { this.legende = legende; }
    public int getOrdre() { return ordre; }
    public void setOrdre(int ordre) { this.ordre = ordre; }
    public Sae getSae() { return sae; }
    public void setSae(Sae sae) { this.sae = sae; }
}
