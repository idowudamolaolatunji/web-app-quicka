import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import BackButton from "../../../components/button/BackButton"

export default function ChoosePlan() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const tabParams = queryParams?.get("option");
    const [subsOption, setSubsOption] = useState("");
    const [selectedPlan, setSelectedPlan] = useState("basic")

    useEffect(function () {
        if (tabParams) {
            setSubsOption(tabParams)
        }
    }, [tabParams]);


    return (
        <React.Fragment>
            <section className="subscription__container">
                <div className="subscription--grid">

                    <div className="subscription--details">
                        {/* <h3>Choose a plan that best fit your business.</h3> */}
                        <h3 className='details--title'><BackButton />Choose a prefered plan.</h3>

                        {(subsOption == "trail") && (
                            <React.Fragment>
                                <p className="details--subtitle">Free trails for 14 days</p>
                                <p className="details--text">Lorem, ipsum dolor sit amet consectetur adipisicing elit. At, obcaecati magni? Assumenda aliquam earum pariatur!</p>
                            </React.Fragment>
                        )}

                        {(subsOption == "offer") && (
                            <React.Fragment>
                                <p className="details--subtitle">Access a 7 day free trails + 30% off any plan</p>
                                <p className="details--text">Lorem, ipsum dolor sit amet consectetur adipisicing elit. At, obcaecati magni? Assumenda aliquam earum pariatur!</p>
                            </React.Fragment>
                        )}

                        {!subsOption && (
                            <p>Hello World</p>
                        )}

                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vero error ea rerum reiciendis? Amet illo quod non doloremque maiores voluptatibus, sapiente quasi est incidunt nemo ea vero placeat quae distinctio. Minima laboriosam possimus explicabo, eligendi fugit eaque voluptate libero incidunt ipsam beatae quis ducimus enim aspernatur maxime facere ullam deleniti, magnam est ab dolorum velit atque placeat! Numquam praesentium architecto tempora, veritatis voluptates dolore nulla totam non facere velit quisquam quibusdam modi autem sunt ad expedita necessitatibus! Soluta similique minus qui animi illum porro nobis nam, nostrum, praesentium quaerat ratione! Nam labore maiores quidem, ea dolores harum quaerat laboriosam tenetur? Ratione veritatis magnam, cum deleniti reiciendis quisquam magni consequatur animi earum suscipit expedita voluptas temporibus error nam cumque aut illo commodi iste similique! Repellat blanditiis expedita eos porro cumque facere ipsa nostrum, nihil unde accusamus neque dolore earum ut amet vero doloremque iusto ullam explicabo? Pariatur, eius nemo, maiores natus blanditiis cupiditate delectus hic distinctio reiciendis exercitationem obcaecati, tempore dolorem alias aperiam dignissimos odio odit ducimus! Dolores distinctio unde est nisi accusantium voluptates! Accusantium cupiditate in repellendus unde, assumenda voluptates pariatur aspernatur blanditiis, quidem illum repellat voluptatum quod! Error omnis sed ab saepe repellat dolores sequi rem possimus incidunt. Deleniti, voluptatibus rem voluptatem quisquam quae ipsam reiciendis alias amet sed blanditiis et dignissimos sapiente distinctio, fugiat reprehenderit qui possimus est eligendi autem voluptatum? Est quasi similique ullam a magnam, voluptatem odio soluta minima odit non nemo voluptas, facilis ipsa dolores facere libero culpa necessitatibus officiis nobis deserunt tempora. Mollitia, eveniet? Quo molestiae, dignissimos dolorem repellendus et assumenda ab ipsam voluptatem consequuntur nam nihil alias. Saepe maiores fuga possimus modi assumenda placeat illo nostrum sequi consequatur amet, sed similique delectus est a eum sit, illum minima sunt excepturi. Magni pariatur odio voluptate eaque laborum beatae facere repellendus tempora, culpa porro esse quaerat nam nulla at fugit, voluptas repudiandae officiis dolore tenetur necessitatibus quos. Tenetur fugiat voluptatum repellat quibusdam quas, voluptates voluptate error consectetur, quaerat officiis accusamus ducimus cupiditate dolore expedita mollitia pariatur aperiam voluptas doloremque unde fuga ullam saepe quia at quidem? Provident expedita consectetur maiores amet eius minus dolorum libero, sed quos corrupti praesentium laborum magnam sunt eos tenetur voluptatem nihil veniam commodi perferendis repellat inventore in iusto? Iusto aliquam inventore, accusamus odio, fugiat cum sed sit laboriosam saepe omnis qui vero voluptatum, eligendi eius officia! A unde, laboriosam fuga commodi voluptatibus aperiam et, dolorum architecto quas reiciendis rerum, vero placeat adipisci earum doloribus aliquam quaerat id nesciunt repellendus debitis laborum praesentium maiores. Sapiente laboriosam corporis accusamus accusantium at, amet obcaecati eum facere optio iure, vero, tempore debitis quia ut. Animi laborum perferendis perspiciatis voluptatem corporis, vitae, magnam ea possimus asperiores et dolorum. Assumenda sequi eaque ut possimus eligendi quo accusamus, dolorem aliquid incidunt, voluptate ullam pariatur ad ratione laborum deserunt quae nihil dolorum ex autem id officiis. Harum in vel tempore iure earum minus itaque explicabo velit quia reiciendis at consequuntur dolor ipsum nostrum, rem beatae sunt repudiandae ipsam odio perspiciatis. Tempora magni doloribus aut! Magni nesciunt a eius fuga excepturi possimus, doloremque rem dolores earum quae porro fugit eos pariatur quisquam quis voluptate itaque, repudiandae quia perspiciatis sed? Odit minima, labore pariatur enim esse libero tenetur velit atque, repellendus doloremque aliquam consequatur provident! Architecto, accusantium. Esse id aliquam deserunt illo voluptatem repellat debitis aperiam, quam itaque ipsum. Facilis sequi sint, ipsum dignissimos ad provident corrupti cupiditate reiciendis rem laudantium perspiciatis distinctio officia iusto animi ut ullam dolore a excepturi expedita maxime at? Repellat eos alias inventore nihil quisquam ullam error quam tenetur tempore sunt explicabo porro velit modi architecto fugit, magni iste nobis aspernatur unde ipsam aliquid. Culpa illum aliquam dignissimos atque sit suscipit sequi odio maiores facere? Explicabo illo consectetur soluta consequatur error nemo voluptatibus tenetur delectus recusandae odit quis nulla sint optio, doloremque harum. Voluptatum recusandae iusto odio fugit possimus quae suscipit dolores voluptates, cum, sapiente rem voluptate eveniet? Qui hic ex quia, sapiente molestias ipsam reiciendis perferendis nobis voluptatem sunt error optio omnis quo sed, rem mollitia dolore odio! Quidem voluptate ad beatae. Accusantium enim ea culpa illo sit dolores harum explicabo, quibusdam velit minima, numquam facere quaerat unde veritatis voluptate at facilis repellat odit et animi! Dolores necessitatibus maiores sed corrupti magni ratione commodi sunt, consequuntur tempora doloribus quam? Quia tenetur cupiditate recusandae nam neque, tempore quo nisi praesentium deleniti sed quibusdam alias, iste quod pariatur labore rem quam quaerat eum fugiat. Voluptates maxime ad nobis odit quia repellendus enim. Dicta saepe quibusdam tempore, perspiciatis aliquid repellat sequi aperiam voluptate aut cumque ullam ipsum recusandae eos necessitatibus, iusto doloremque non dolore sit ut harum libero et maiores fuga amet. Cupiditate accusantium rem mollitia recusandae magnam, veniam iure nesciunt nulla nam, amet obcaecati ad. Repellendus, dolores deserunt officia optio voluptates deleniti temporibus dignissimos amet distinctio quasi tempora sequi veritatis? Tenetur omnis consequuntur aliquam illo doloremque. Autem ea animi impedit consectetur saepe repudiandae quam corrupti odio nesciunt atque, neque nam mollitia distinctio voluptate dolorem iure quasi vel quia aliquid exercitationem id nisi pariatur vero. Incidunt voluptas veritatis neque autem consectetur quod officia deserunt, corporis doloremque, debitis soluta quos ut at facere voluptatibus illo eum magni aliquam aliquid, omnis cumque rem culpa nihil. Odit odio rerum earum esse deserunt voluptate aliquid nesciunt vel eos. Nam id voluptatem, alias quis rem soluta autem, animi porro ipsam corrupti sapiente nihil sit amet dolores repellat tenetur eveniet quasi voluptates architecto cumque? Illum minima reprehenderit recusandae hic laboriosam ex velit! Odit, rem voluptatibus? Quae impedit, nesciunt at eveniet ad natus, sunt dolorem cum possimus quam ex voluptatum nam distinctio. Voluptatem culpa error impedit perferendis alias ab? Repudiandae dolores temporibus repellendus nesciunt suscipit, minima laboriosam enim tempore libero rerum neque doloribus nostrum error pariatur, maxime nihil. Natus suscipit magni, odit hic sint saepe voluptates! Veritatis, iure inventore quibusdam fugiat vero ex quae provident, ipsa eaque, vel eveniet! Laborum expedita aperiam earum, harum quasi repellendus repudiandae at laboriosam saepe, minima, dignissimos reiciendis. Earum quis totam optio quae animi, corporis dicta velit excepturi voluptate pariatur labore rerum necessitatibus maxime nulla ipsa voluptates repudiandae autem!
                    </div>

                    <div className="subcription--plans">

                        <div className={`plan--container ${selectedPlan == "basic" ? "is-selected" : ""}`} onClick={() => setSelectedPlan("basic")}>
                            
                            <span />

                            <div className="">
                                <p>Lorem, ipsum dolor.</p>
                            </div>

                        </div>
                        <div className={`plan--container ${selectedPlan == "lite" ? "is-selected" : ""}`} onClick={() => setSelectedPlan("lite")}>

                            <span />

                        </div>
                        <div className={`plan--container ${selectedPlan == "pro" ? "is-selected" : ""}`} onClick={() => setSelectedPlan("pro")}>

                            <span />

                        </div>
                    </div>

                </div>
            </section>
        </React.Fragment>
    )
}